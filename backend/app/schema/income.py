from datetime import date
from pydantic import BaseModel

class IncomeCreate(BaseModel):
    label: str
    income_desc: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

class IncomeOut(BaseModel):
    income_id: int
    user_id: int
    label: str
    income_desc: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

    class Config:
        from_attributes = True