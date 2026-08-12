from datetime import date
from pydantic import BaseModel

class UserOut(BaseModel):
    user_id: int
    firstname: str
    lastname: str  

    class Config:
        from_attributes = True