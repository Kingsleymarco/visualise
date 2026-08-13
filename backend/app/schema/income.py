from datetime import date
from pydantic import BaseModel

class IncomeCreate(BaseModel):
    label: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

class IncomeOut(BaseModel):
    income_id: int
    user_id: int
    label: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

    class Config:
        from_attributes = True