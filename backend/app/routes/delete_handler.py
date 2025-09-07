from fastapi import APIRouter, HTTPException
from app.utils.firebase import db

router = APIRouter()

@router.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: str):
    doc_ref = db.collection("recipes").document(recipe_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Recipe not found")

    doc_ref.delete()
    return {"message": "Recipe deleted"}
