from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List
from app.utils.firebase import get_db
from app.models.category import Category
from firebase_admin import firestore

router = APIRouter()

class ReorderItem(BaseModel):
    id: str
    order: int

@router.get("/api/categories")
def get_categories():
    db = get_db()
    docs = db.collection("categories").order_by("order").stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]

@router.post("/api/categories", status_code=201)
def create_category(cat: Category):
    db = get_db()

    last = list(
        db.collection("categories")
        .order_by("order", direction=firestore.Query.DESCENDING)
        .limit(1)
        .stream()
    )
    next_order = (last[0].to_dict().get("order", 0) if last else 0) + 1

    data = cat.dict()
    if data.get("order") is None:
        data["order"] = next_order

    doc_ref = db.collection("categories").document()  # auto ID
    doc_ref.set(data)

    return {"id": doc_ref.id, **data}

@router.patch("/api/categories/{id}")
def update_category(id: str, payload: dict):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.update(payload)
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}

@router.delete("/api/categories/{id}", status_code=204)
def delete_category(id: str):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.delete()
    return

@router.patch("/api/categories/reorder", status_code=204)
def reorder_categories(items: List[ReorderItem] = Body(...)):
    db = get_db()
    batch = db.batch()
    for it in items:
        batch.update(db.collection("categories").document(it.id), {"order": it.order})
    batch.commit()
    return
