from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.income import Income
from models.expense import Expense
from engine.flux_engine import calculate_forecast

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/forecast")
def get_forecast(month: str, user_id: int, db: Session = Depends(get_db)):
    incomes = db.query(Income).filter(Income.user_id == user_id).all()
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    result = calculate_forecast(incomes, expenses, month)
    return result