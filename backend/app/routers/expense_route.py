from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.expense import Expense
from schema.expense import ExpenseCreate, ExpenseOut
from models.category import Category
from schema.category import CategoryOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/expense", response_model=ExpenseOut)
def create_expense(expense: ExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    new_expense = Expense(**expense.model_dump(), user_id=user_id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/expense", response_model=list[ExpenseOut])
def get_all_expenses(user_id: int, db: Session = Depends(get_db)):
    return db.query(Expense).filter(Expense.user_id == user_id).all()

@router.get("/expense/{expense_id}", response_model=ExpenseOut)
def get_expense_entry(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail=f"Expense entry {expense_id} not found")
    return expense

@router.put("/expense/{expense_id}", response_model=ExpenseOut)
def update_expense_entry(expense_id: int, updated: ExpenseCreate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail=f"Expense entry {expense_id} not found")

    for key, value in updated.model_dump().items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/expense/{expense_id}")
def delete_expense_entry(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail=f"Expense entry {expense_id} not found")
    db.delete(expense)
    db.commit()
    return {"detail": "Expense deleted"}

@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()