from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    id: int
    username: str
    date_created: datetime
    last_login: Optional[datetime]

class Verifycode(BaseModel):
    email: str
    code: str

# Modelo para datos de inicio de sesión
class UserLogin(BaseModel):
    username: str
    password: str

#Cambiar password con password vieja
class ChangePassword(BaseModel):
    username: str
    current_password: str
    new_password: str
    
 #Cambiar password olvidada
class ForgotPassword(BaseModel):
    username: str