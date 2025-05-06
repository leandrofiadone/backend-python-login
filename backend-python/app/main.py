from fastapi import FastAPI, Depends
#from forms_router import router as forms_router
from fastapi.middleware.cors import CORSMiddleware
#from auth_router import router as auth_router
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from forms_router import router as forms_router
from auth_router import router as auth_router

# Crea una instancia de la aplicación FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
    allow_origins=["*"])

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(forms_router, prefix="/forms", tags=["forms"])