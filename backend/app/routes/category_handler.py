from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.utils.firebase import get_db
from app.models.category import Category
from firebase_admin import firestore

router = APIRouter()

class ReorderItem(BaseModel):
    id: str
    order: int

class ReorderPayload(BaseModel):
    items: List[ReorderItem]

class CategoryUpdate(BaseModel):
    name: Optional[str]
    slug: Optional[str]
    description: Optional[str] = None
    order: Optional[int]
    parentId: Optional[str | None]
    type: Optional[str] = None

@router.get("/categories")
def get_categories():
    db = get_db()
    docs = db.collection("categories").order_by("order").stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]

@router.post("/categories", status_code=201)
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

    doc_ref = db.collection("categories").document()
    doc_ref.set(data)

    return {"id": doc_ref.id, **data}

@router.patch("/categories/reorder", status_code=204)
def reorder_categories(payload: ReorderPayload):
    db = get_db()
    batch = db.batch()
    for it in payload.items:
        batch.update(db.collection("categories").document(it.id), {"order": it.order})
    batch.commit()
    return

@router.patch("/categories/{id}")
def update_category(id: str, payload: CategoryUpdate):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.update(payload.dict(exclude_unset=True))
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}

@router.delete("/categories/{id}", status_code=204)
def delete_category(id: str):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.delete()
    return
