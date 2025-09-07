from fastapi import APIRouter, HTTPException
from app.models.recipe import Recipe
from app.utils.firebase import db

router = APIRouter()

@router.patch("/api/recipes/{recipe_id}")
def update_recipe(recipe_id: str, recipe: Recipe):
    doc_ref = db.collection("recipes").document(recipe_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Recipe not found")

    doc_ref.update(recipe.dict())
    return {"message": "Recipe updated"}
