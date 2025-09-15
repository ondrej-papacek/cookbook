from fastapi import APIRouter, HTTPException, Body, Request
from pydantic import BaseModel
from typing import List, Any
from app.utils.firebase import get_db
from app.models.category import Category
from firebase_admin import firestore as fb_fs

router = APIRouter()

class ReorderItem(BaseModel):
    slug: str
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
        .order_by("order", direction=fb_fs.Query.DESCENDING)
        .limit(1).stream()
    )
    next_order = (last[0].to_dict().get("order", 0) if last else 0) + 1

    data = cat.dict()
    if data.get("order") is None:
        data["order"] = next_order

    doc_ref = db.collection("categories").document()
    doc_ref.set(data)

    return {"id": doc_ref.id, **data}

@router.patch("/api/categories/{slug}")
def update_category(slug: str, payload: dict):
    db = get_db()
    doc_ref = db.collection("categories").document(slug)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.update(payload)
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}

@router.delete("/api/categories/{slug}", status_code=204)
def delete_category(slug: str):
    db = get_db()
    doc_ref = db.collection("categories").document(slug)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.delete()
    return

@router.patch("/api/categories/reorder", status_code=204)
async def reorder_categories(request: Request):
    """
    Přijímá buď:
    [
      {"slug": "snidane", "order": 0},
      {"slug": "vecere", "order": 1}
    ]
    nebo:
    { "items": [ ... ] }
    """
    db = get_db()

    payload: Any = await request.json()
    # Log pro debug – uvidíš v Render logs
    print("REORDER payload:", payload)

    # Podpora obou tvarů
    in_items = payload.get("items") if isinstance(payload, dict) else payload

    if not isinstance(in_items, list):
        raise HTTPException(status_code=422, detail="Invalid payload, expected list of items")

    try:
        items = [ReorderItem.model_validate(it) for it in in_items]
    except Exception as e:
        print("REORDER validation error:", e)
        raise HTTPException(status_code=422, detail="Invalid item shape (slug:string, order:int required)")

    batch = db.batch()
    for it in items:
        batch.update(db.collection("categories").document(it.slug), {"order": it.order})
    batch.commit()
    return
