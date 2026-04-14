from fastapi import APIRouter, Depends, HTTPException
from app.models.recipe import Recipe, RecipeWithID
from app.utils.auth import verify_token
from app.utils.firebase import get_db
import random
import json
import re
import httpx
from bs4 import BeautifulSoup

router = APIRouter(
    dependencies=[Depends(verify_token)]
)


@router.get("/recipes", response_model=list[RecipeWithID])
def get_recipes():
    db = get_db()
    recipes_ref = db.collection("recipes").stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in recipes_ref]

@router.get("/recipes/search")
def search_recipes(q: str):
    db = get_db()
    recipes_ref = db.collection("recipes").stream()
    q_lower = q.lower()

    results = []
    for doc in recipes_ref:
        data = doc.to_dict()

        name = data.get("name", "").lower()
        tags = [t.lower() for t in data.get("tags", [])]
        ingredients = [i.lower() for i in data.get("ingredients", [])]

        if (
                q_lower in name
                or any(q_lower in tag for tag in tags)
                or any(q_lower in ing for ing in ingredients)
        ):
            results.append({**data, "id": doc.id})

    return results

@router.get("/recipes/random", response_model=RecipeWithID)
def get_random_recipe():
    db = get_db()
    docs = list(db.collection("recipes").stream())
    if not docs:
        raise HTTPException(status_code=404, detail="No recipes found")

    chosen = random.choice(docs)
    return {**chosen.to_dict(), "id": chosen.id}

@router.get("/recipes/{recipe_id}", response_model=RecipeWithID)
def get_recipe(recipe_id: str):
    db = get_db()
    doc = db.collection("recipes").document(recipe_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {**doc.to_dict(), "id": doc.id}


@router.post("/recipes", status_code=201)
def create_recipe(recipe: Recipe):
    db = get_db()
    doc_ref = db.collection("recipes").document()
    doc_ref.set(recipe.dict())
    return {"id": doc_ref.id, **recipe.dict()}


@router.patch("/recipes/{recipe_id}", response_model=RecipeWithID)
def update_recipe(recipe_id: str, updated_data: dict):
    db = get_db()
    doc_ref = db.collection("recipes").document(recipe_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")
    doc_ref.update(updated_data)
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}


@router.delete("/recipes/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: str):
    db = get_db()
    doc_ref = db.collection("recipes").document(recipe_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")
    doc_ref.delete()
    return


def _parse_duration(value) -> int | None:
    """Parse ISO 8601 duration (PT30M, PT1H30M) to minutes."""
    if not value:
        return None
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", str(value))
    if m:
        hours = int(m.group(1) or 0)
        mins = int(m.group(2) or 0)
        total = hours * 60 + mins
        return total if total > 0 else None
    return None


def _extract_instruction_text(item) -> str:
    if isinstance(item, str):
        return item.strip()
    if isinstance(item, dict):
        return item.get("text", "").strip()
    return ""


def _find_recipe_ld(soup: BeautifulSoup):
    """Find a schema.org Recipe object in JSON-LD scripts."""
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            ld = json.loads(script.string or "")
        except Exception:
            continue

        # Unwrap @graph
        if isinstance(ld, dict) and "@graph" in ld:
            ld = ld["@graph"]

        # Array — find the Recipe entry
        if isinstance(ld, list):
            for item in ld:
                if isinstance(item, dict) and item.get("@type") == "Recipe":
                    return item
        elif isinstance(ld, dict) and ld.get("@type") == "Recipe":
            return ld

    return None


@router.post("/import-recipe")
async def import_recipe(data: dict):
    url = (data.get("url") or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36"
        ),
        "Accept-Language": "cs,en;q=0.9",
    }

    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=422, detail=f"Stránka vrátila chybu: {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Nepodařilo se načíst URL: {str(e)}")

    soup = BeautifulSoup(response.text, "html.parser")
    recipe_data = _find_recipe_ld(soup)

    if not recipe_data:
        raise HTTPException(
            status_code=422,
            detail="Na této stránce nebyl nalezen recept. Stránka nepodporuje standardní formát."
        )

    # Ingredients
    ingredients = [
        i.strip()
        for i in recipe_data.get("recipeIngredient", [])
        if isinstance(i, str) and i.strip()
    ]

    # Steps
    steps = []
    instructions = recipe_data.get("recipeInstructions", [])
    if isinstance(instructions, str):
        steps = [s.strip() for s in instructions.split("\n") if s.strip()]
    elif isinstance(instructions, list):
        for item in instructions:
            if isinstance(item, dict) and item.get("@type") == "HowToSection":
                for sub in item.get("itemListElement", []):
                    text = _extract_instruction_text(sub)
                    if text:
                        steps.append(text)
            else:
                text = _extract_instruction_text(item)
                if text:
                    steps.append(text)

    # Image
    image = None
    img_data = recipe_data.get("image")
    if isinstance(img_data, str):
        image = img_data
    elif isinstance(img_data, list) and img_data:
        first = img_data[0]
        image = first if isinstance(first, str) else first.get("url")
    elif isinstance(img_data, dict):
        image = img_data.get("url")

    return {
        "name": recipe_data.get("name", ""),
        "ingredients": ingredients,
        "steps": steps,
        "image": image,
        "prepTime": _parse_duration(recipe_data.get("prepTime")),
        "cookTime": _parse_duration(recipe_data.get("cookTime")),
    }
