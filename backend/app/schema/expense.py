from datetime import date
from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    category_id: int
    label: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

class ExpenseOut(BaseModel):
    expense_id: int
    user_id: int
    category_id: int
    label: str
    amount: float
    is_recurring: bool
    recurrence: str
    start_date: date

    class Config:
        from_attributes = True