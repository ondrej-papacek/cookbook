from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from app.models.meal_plan import MealPlan, MealPlanWithID, MealPlanUpdate
from app.utils.auth import verify_token
from app.utils.firebase import get_db
from app.utils.rate_limit import limiter

router = APIRouter(
    dependencies=[Depends(verify_token)]
)

_COLLECTION = "meal_plans"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("/meal-plans", response_model=list[MealPlanWithID])
def get_meal_plans(request: Request):
    db = get_db()
    plans_ref = db.collection(_COLLECTION).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in plans_ref]


@router.get("/meal-plans/{plan_id}", response_model=MealPlanWithID)
def get_meal_plan(request: Request, plan_id: str):
    db = get_db()
    doc = db.collection(_COLLECTION).document(plan_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return {**doc.to_dict(), "id": doc.id}


@router.post("/meal-plans", status_code=201, response_model=MealPlanWithID)
@limiter.limit("30/minute")
def create_meal_plan(request: Request, plan: MealPlan):
    db = get_db()
    payload = plan.model_dump()
    now = _now()
    payload["createdAt"] = now
    payload["updatedAt"] = now
    doc_ref = db.collection(_COLLECTION).document()
    doc_ref.set(payload)
    return {**payload, "id": doc_ref.id}


@router.patch("/meal-plans/{plan_id}", response_model=MealPlanWithID)
@limiter.limit("60/minute")
def update_meal_plan(request: Request, plan_id: str, updated_data: MealPlanUpdate):
    db = get_db()
    doc_ref = db.collection(_COLLECTION).document(plan_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    payload = updated_data.model_dump(exclude_unset=True)
    payload["updatedAt"] = _now()
    doc_ref.update(payload)
    new_doc = doc_ref.get()
    return {**new_doc.to_dict(), "id": new_doc.id}


@router.delete("/meal-plans/{plan_id}", status_code=204)
@limiter.limit("30/minute")
def delete_meal_plan(request: Request, plan_id: str):
    db = get_db()
    doc_ref = db.collection(_COLLECTION).document(plan_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    doc_ref.delete()
    return