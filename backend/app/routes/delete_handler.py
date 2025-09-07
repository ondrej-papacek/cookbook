from fastapi import APIRouter, HTTPException
from app.utils.firebase import get_db

router = APIRouter()

@router.delete("/api/recipes/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: str):
    db = get_db()
    doc_ref = db.collection("recipes").document(recipe_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Recipe not found")
    doc_ref.delete()
    return
