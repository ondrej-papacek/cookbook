from fastapi import APIRouter, HTTPException
from app.models.recipe import Recipe
from app.utils.firebase import db

router = APIRouter()


@router.post("/api/recipes", status_code=201)
def create_recipe(recipe: Recipe):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    doc_ref = db.collection("recipes").document()
    doc_ref.set(recipe.dict())

    return {"id": doc_ref.id, **recipe.dict()}
