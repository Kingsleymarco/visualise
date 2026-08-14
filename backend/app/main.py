from fastapi import FastAPI
from database import Base, engine
from models import user,income,expense,category
from seed import seed_categories
from backend.app.routers import income_route
from backend.app.routers import expense_route

app = FastAPI()
Base.metadata.create_all(engine)
seed_categories()

app.include_router(income_route.router)
app.include_router(expense_route.router)