from pydantic import BaseModel
from typing import List, Optional

class Recipe(BaseModel):
    name: str
    category: str
    tags: List[str]
    ingredients: List[str]
    steps: List[str]
    image: Optional[str] = None
    diet: Optional[List[str]] = []
    season: Optional[str] = None

class RecipeWithID(Recipe):
    id: str
