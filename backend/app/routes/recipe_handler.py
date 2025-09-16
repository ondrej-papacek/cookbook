from fastapi import APIRouter, HTTPException
from app.models.recipe import Recipe, RecipeWithID
from app.utils.firebase import get_db

router = APIRouter()


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
