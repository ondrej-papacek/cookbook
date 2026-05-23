from pydantic import BaseModel, Field
from typing import List, Optional, Literal


_NAME_MAX = 200
_RECIPE_NAME_MAX = 200
_URL_MAX = 2048
_MEALS_MAX = 400
_DATE = r"^\d{4}-\d{2}-\d{2}$"


class PlannedMeal(BaseModel):
    date: str = Field(..., pattern=_DATE)
    slot: Literal["obed", "vecere"]
    recipeId: str = Field(..., min_length=1, max_length=128)
    recipeName: str = Field(..., min_length=1, max_length=_RECIPE_NAME_MAX)
    recipeImage: Optional[str] = Field(None, max_length=_URL_MAX)


class MealPlan(BaseModel):
    name: str = Field(..., min_length=1, max_length=_NAME_MAX)
    startDate: str = Field(..., pattern=_DATE)
    endDate: str = Field(..., pattern=_DATE)
    meals: List[PlannedMeal] = Field(default_factory=list, max_length=_MEALS_MAX)
    createdAt: Optional[str] = Field(None, max_length=40)
    updatedAt: Optional[str] = Field(None, max_length=40)


class MealPlanWithID(MealPlan):
    id: str


class MealPlanUpdate(BaseModel):
    """All-optional variant for PATCH. Unset fields are not persisted."""
    name: Optional[str] = Field(None, min_length=1, max_length=_NAME_MAX)
    startDate: Optional[str] = Field(None, pattern=_DATE)
    endDate: Optional[str] = Field(None, pattern=_DATE)
    meals: Optional[List[PlannedMeal]] = Field(None, max_length=_MEALS_MAX)
