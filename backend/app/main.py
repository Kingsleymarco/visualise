from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import user,income,expense,category
from seed import seed_categories
from routers import income_route
from routers import expense_route
from routers import forecast_route

app = FastAPI()
Base.metadata.create_all(engine)
seed_categories()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(income_route.router)
app.include_router(expense_route.router)
app.include_router(forecast_route.router)