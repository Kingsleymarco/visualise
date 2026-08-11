from database import Base
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"
    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(50), nullable=False)
    is_necessity = Column(Boolean, nullable=False)
    expenses = relationship("Expense", back_populates="category")