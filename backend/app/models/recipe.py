from pydantic import BaseModel
from typing import List, Optional

class Recipe(BaseModel):
    name: str
    categories: List[str]
    tags: List[str] = []
    ingredients: List[str]
    steps: List[str]
    image: Optional[str] = None
    youtubeUrl: Optional[str] = None

class RecipeWithID(Recipe):
    id: str
