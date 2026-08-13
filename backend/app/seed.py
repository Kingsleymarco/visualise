from database import SessionLocal
from models import Category

def seed_categories():
  db = SessionLocal()

  categories = [
    Category(category_name="Rent/Housing", is_necessity=True),
    Category(category_name="Food & Groceries", is_necessity=True),
    Category(category_name="Transport", is_necessity=True),
    Category(category_name="Health", is_necessity=True),
    Category(category_name="Education", is_necessity=True),
    Category(category_name="Savings", is_necessity=True),
    Category(category_name="Subscriptions", is_necessity=False),
    Category(category_name="Entertainment", is_necessity=False),
    Category(category_name="Other", is_necessity=False),
  ]

  # Check for any new categories if such exists add into database.
  for category in categories:
    existing = db.query(Category).filter(Category.category_name == category.category_name).first()
    if not existing:
      db.add(category)
  db.commit()