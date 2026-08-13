from fastapi import FastAPI
from database import Base, engine
from models import user,income,expense,category
from seed import seed_categories

app = FastAPI()
Base.metadata.create_all(engine)
seed_categories()