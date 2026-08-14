from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.income import Income
from schema.income import IncomeCreate, IncomeOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/income", response_model=IncomeOut)
def create_income(income: IncomeCreate, user_id: int, db: Session = Depends(get_db)):
    new_income = Income(**income.model_dump(), user_id=user_id)
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

@router.get("/income", response_model=list[IncomeOut])
def get_all_incomes(user_id: int, db: Session = Depends(get_db)):
    return db.query(Income).filter(Income.user_id == user_id).all()

@router.get("/income/{income_id}", response_model=IncomeOut)
def get_income_entry(income_id: int, db: Session = Depends(get_db)):
    income = db.query(Income).filter(Income.income_id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail=f"Income entry {income_id} not found")
    return income

@router.put("/income/{income_id}", response_model=IncomeOut)
def update_income_entry(income_id: int, updated: IncomeCreate, db: Session = Depends(get_db)):
    income = db.query(Income).filter(Income.income_id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail=f"Income entry {income_id} not found")

    for key, value in updated.model_dump().items():
        setattr(income, key, value)

    db.commit()
    db.refresh(income)
    return income

@router.delete("/income/{income_id}")
def delete_income_entry(income_id: int, db: Session = Depends(get_db)):
    income = db.query(Income).filter(Income.income_id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail=f"Income entry {income_id} not found")
    db.delete(income)
    db.commit()
    return {"detail": "Income deleted"}