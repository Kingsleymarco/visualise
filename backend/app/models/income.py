from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Boolean, Date
from sqlalchemy.orm import relationship

class Income(Base):
    __tablename__ = "incomes"
    income_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    label = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    is_recurring = Column(Boolean, nullable=False)
    recurrence = Column(String(20), nullable=False)
    start_date = Column(Date, nullable=False)
    user = relationship("User", back_populates="incomes")