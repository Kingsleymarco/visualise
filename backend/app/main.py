from fastapi import FastAPI
from database import Base, engine
from models import user,income,expense,category

app = FastAPI()
Base.metadata.create_all(engine)