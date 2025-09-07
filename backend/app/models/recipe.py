from pydantic import BaseModel
from typing import List

class Recipe(BaseModel):
    name: str
    category: str
    tags: List[str]
    ingredients: List[str]
    steps: List[str]

class RecipeWithID(Recipe):
    id: str
