from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    incomes = relationship("Income", back_populates="user")
    expenses = relationship("Expense", back_populates="user")