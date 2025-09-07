from fastapi import APIRouter, HTTPException
from app.models.recipe import Recipe
from app.utils.firebase import db

router = APIRouter()

@router.patch("/api/recipes/{recipe_id}", response_model=Recipe)
def update_recipe(recipe_id: str, updated_data: Recipe):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    doc_ref = db.collection("recipes").document(recipe_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")

    doc_ref.update(updated_data.dict())
    return updated_data
