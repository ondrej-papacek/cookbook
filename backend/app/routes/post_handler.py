from fastapi import APIRouter
from app.models.recipe import Recipe
from app.utils.firebase import db

router = APIRouter()

@router.post("/api/recipes")
def create_recipe(recipe: Recipe):
    data = recipe.dict()
    doc_ref = db.collection("recipes").add(data)
    return {"message": "Recipe created", "id": doc_ref[1].id}
