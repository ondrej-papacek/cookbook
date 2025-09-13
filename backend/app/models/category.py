from pydantic import BaseModel
from typing import Optional

class Category(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    order: Optional[int] = None
