from datetime import date
from pydantic import BaseModel

class CategoryOut(BaseModel):
    category_id: int
    category_name: str
    is_necessity: bool  

    class Config:
        from_attributes = True