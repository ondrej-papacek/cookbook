from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.utils.auth import verify_token
from app.utils.rate_limit import limiter
from typing import List, Optional, Union
from app.utils.firebase import get_db
from app.models.category import Category
from firebase_admin import firestore

router = APIRouter(
    dependencies=[Depends(verify_token)]
)

from pydantic import Field

class ReorderItem(BaseModel):
    id: str = Field(..., min_length=1, max_length=128)
    order: int = Field(..., ge=0, le=100000)

class ReorderPayload(BaseModel):
    items: List[ReorderItem] = Field(..., max_length=500)

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100, pattern=r"^[a-z0-9][a-z0-9\-]*$")
    description: Optional[str] = Field(None, max_length=1000)
    order: Optional[int] = Field(None, ge=0, le=100000)
    parentId: Optional[str] = Field(None, max_length=128)
    type: Optional[str] = Field(None, max_length=50)

@router.get("/categories")
def get_categories(request: Request):
    db = get_db()
    docs = db.collection("categories").order_by("order").stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]

@router.post("/categories", status_code=201)
@limiter.limit("20/minute")
def create_category(request: Request, cat: Category):
    db = get_db()

    last = list(
        db.collection("categories")
        .order_by("order", direction=firestore.Query.DESCENDING)
        .limit(1)
        .stream()
    )
    next_order = (last[0].to_dict().get("order", 0) if last else 0) + 1

    data = cat.model_dump()
    if data.get("order") is None:
        data["order"] = next_order

    doc_ref = db.collection("categories").document()
    doc_ref.set(data)

    return {"id": doc_ref.id, **data}

@router.patch("/categories/reorder", status_code=204)
@limiter.limit("20/minute")
def reorder_categories(request: Request, payload: ReorderPayload):
    db = get_db()
    batch = db.batch()
    for it in payload.items:
        batch.update(db.collection("categories").document(it.id), {"order": it.order})
    batch.commit()
    return

@router.patch("/categories/{id}")
@limiter.limit("20/minute")
def update_category(request: Request, id: str, payload: CategoryUpdate):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = payload.model_dump(exclude_unset=True, exclude_none=True)
    doc_ref.update(update_data)
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}


@router.delete("/categories/{id}", status_code=204)
@limiter.limit("20/minute")
def delete_category(request: Request, id: str):
    db = get_db()
    doc_ref = db.collection("categories").document(id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")
    doc_ref.delete()
    return
