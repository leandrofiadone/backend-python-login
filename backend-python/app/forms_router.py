from fastapi import  Depends, APIRouter,HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth_router import SECRET_KEY, ALGORITHM

import jwt

router = APIRouter()


# Endpoint seguro que requiere un token JWT válido para acceder
@router.get("/secure_endpoint")
async def secure_endpoint(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    try:
        # Intenta decodificar y verificar el token JWT
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        # Si el token es válido, devuelve un mensaje de éxito
        return {"message": f"Hello, {payload['sub']}. You have access to this secure endpoint."}
    except jwt.PyJWTError:
        # Si hay algún error con el token, devuelve un error de autenticación
        raise HTTPException(status_code=401, detail="Invalid or expired token")