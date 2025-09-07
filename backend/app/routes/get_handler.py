from fastapi import APIRouter, HTTPException
from app.models.recipe import RecipeWithID
from backend.app.utils.firebase import db

router = APIRouter()

@router.get("/api/recipes", response_model=list[RecipeWithID])
def get_recipes():
    recipes_ref = db.collection("recipes").stream()
    return [
        {**doc.to_dict(), "id": doc.id}
        for doc in recipes_ref
    ]

@router.get("/api/recipes/{recipe_id}", response_model=RecipeWithID)
def get_recipe(recipe_id: str):
    doc = db.collection("recipes").document(recipe_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {**doc.to_dict(), "id": doc.id}
