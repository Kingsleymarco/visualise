from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Boolean, Date
from sqlalchemy.orm import relationship

class Expense(Base):
    __tablename__ = "expenses"
    expense_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    label = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    is_recurring = Column(Boolean, nullable=False)
    recurrence = Column(String(20), nullable=False)
    start_date = Column(Date, nullable=False)
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")