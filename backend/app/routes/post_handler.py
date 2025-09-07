from fastapi import APIRouter
from app.models.recipe import Recipe
from app.utils.firebase import get_db

router = APIRouter()

@router.post("/api/recipes", status_code=201)
def create_recipe(recipe: Recipe):
    db = get_db()
    doc_ref = db.collection("recipes").document()
    doc_ref.set(recipe.dict())
    return {"id": doc_ref.id, **recipe.dict()}
