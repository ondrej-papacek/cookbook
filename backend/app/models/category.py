from pydantic import BaseModel, Field
from typing import Optional


class Category(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9][a-z0-9\-]*$")
    description: Optional[str] = Field(None, max_length=1000)
    order: Optional[int] = Field(None, ge=0, le=100000)
    parentId: Optional[str] = Field(None, max_length=128)