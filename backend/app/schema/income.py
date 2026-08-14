from datetime import date
from pydantic import BaseModel, model_validator
from enum import Enum
from typing import Optional

class RecurrenceCategory(str, Enum):
    Once = "Once"
    Daily = "Daily"
    Weekly = "Weekly"
    Monthly = "Monthly"
    Yearly = "Yearly"
    Custom = "Custom"

class IncomeCreate(BaseModel):
    label: str
    amount: float
    recurrence: Optional[RecurrenceCategory] = None
    recurrence_interval: Optional[int] = None
    start_date: date

    @model_validator(mode="after")
    def check_custom_days(self):
        if self.recurrence == RecurrenceCategory.Custom and self.recurrence_interval is None:
            raise ValueError("recurrence_interval is required when recurrence is 'Custom'")
        return self

class IncomeOut(BaseModel):
    income_id: int
    user_id: int
    label: str
    amount: float
    recurrence: Optional[RecurrenceCategory] = None
    recurrence_interval: Optional[int] = None
    start_date: date

    class Config:
        from_attributes = True