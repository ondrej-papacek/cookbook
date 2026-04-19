from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional


# Generous caps — real recipes don't come close. Intent is to block abuse payloads
# (multi-MB strings, 10k-item lists) rather than restrict normal use.
_NAME_MAX = 200
_TAG_MAX = 50
_INGREDIENT_MAX = 500
_STEP_MAX = 4000
_URL_MAX = 2048


class Recipe(BaseModel):
    name: str = Field(..., min_length=1, max_length=_NAME_MAX)
    categories: List[str] = Field(default_factory=list, max_length=50)
    tags: List[str] = Field(default_factory=list, max_length=50)
    ingredients: List[str] = Field(default_factory=list, max_length=200)
    steps: List[str] = Field(default_factory=list, max_length=200)
    image: Optional[str] = Field(None, max_length=_URL_MAX)
    youtubeUrl: Optional[str] = Field(None, max_length=_URL_MAX)
    prepTime: Optional[int] = Field(None, ge=0, le=24 * 60)   # minutes, ≤ 24h
    cookTime: Optional[int] = Field(None, ge=0, le=24 * 60)


class RecipeWithID(Recipe):
    id: str


class RecipeUpdate(BaseModel):
    """All-optional variant for PATCH. Unset fields are not persisted."""
    name: Optional[str] = Field(None, min_length=1, max_length=_NAME_MAX)
    categories: Optional[List[str]] = Field(None, max_length=50)
    tags: Optional[List[str]] = Field(None, max_length=50)
    ingredients: Optional[List[str]] = Field(None, max_length=200)
    steps: Optional[List[str]] = Field(None, max_length=200)
    image: Optional[str] = Field(None, max_length=_URL_MAX)
    youtubeUrl: Optional[str] = Field(None, max_length=_URL_MAX)
    prepTime: Optional[int] = Field(None, ge=0, le=24 * 60)
    cookTime: Optional[int] = Field(None, ge=0, le=24 * 60)