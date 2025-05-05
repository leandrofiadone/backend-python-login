from fastapi import Depends, APIRouter
from fastapi.responses import JSONResponse
import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from datetime import datetime
from bcrypt import hashpw, gensalt
import bcrypt
import re
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import models, schemas
from conexion import SessionLocal,engine

router = APIRouter()

# Crea las tablas en la base de datos si no existen
models.Base.metadata.create_all(bind=engine)

# Función para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def send_verification_email(email: str, verification_code: str, expiration_date: datetime):
    # Configurar el servidor SMTP de Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # El puerto para SMTP en Gmail

    sender_email = "rocio.mendez@meetsuper.com"
    sender_password = "sagp xbyd gqtv aeog"

    # Configurar el correo electrónico del destinatario
    receiver_email = email

    # Crear el mensaje de correo electrónico
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = "Código de verificación para tu cuenta"

    # Crear el cuerpo del mensaje
    body = f"""
    ¡Hola!

    Has solicitado un código de verificación para crear una cuenta en nuestra plataforma.
    Aquí está tu código de verificación: {verification_code}

    Este código expirará el: {expiration_date.strftime("%Y-%m-%d %H:%M:%S")}

    ¡Gracias por unirte a nosotros!
    """
    msg.attach(MIMEText(body, "plain"))

    # Iniciar sesión en el servidor SMTP y enviar el correo electrónico
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("Correo electrónico de verificación enviado exitosamente")
    except Exception as e:
        print("Error al enviar el correo electrónico de verificación:", e)
#------------------------
#Crea usuario y envia mail
@router.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Verifica si el usuario ya existe en la base de datos
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if existing_user:
            return JSONResponse(status_code=400, content={"detail": "Username already exists"})
        
        # Verifica si el username (correo electrónico) tiene el formato correcto (hacerlo solo para super Y DESPLEGAR AVISO DE LOS REQUERIMIENTOS)
        if not re.match(r"[^@]+@[^@]+\.[^@]+", user.username):
            return JSONResponse(status_code=400, content={"detail": "Invalid email format"})
        
        # Verifica si la contraseña cumple con los requisitos
        if not re.match(r"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-+=])(?=\S+$).{8,}$", user.password):
            return JSONResponse(status_code=400, content={"detail": "Password requirements not met"})

        # Genera un código de verificación aleatorio
        verification_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Calcula la fecha y hora de vencimiento del código de verificación (por ejemplo, 24 horas después de la creación)
        verification_expires_at = datetime.utcnow() + timedelta(hours=24)
        
        # Hashea la contraseña antes de almacenarla en la base de datos
        hashed_password = hashpw(user.password.encode('utf-8'), gensalt())
        
        # Crea un nuevo usuario en la base de datos con el código de verificación y la contraseña hasheada
        new_user = models.User(username=user.username, password_hash=hashed_password, verification_code=verification_code, verification_expires_at=verification_expires_at)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
                
        # Envía el correo electrónico de verificación al usuario
        send_verification_email(user.username, verification_code, verification_expires_at)
        
        # Devuelve los datos del usuario creado utilizando el modelo Pydantic
        return schemas.UserResponse(id=new_user.id, username=new_user.username, date_created=new_user.date_created, last_login=new_user.last_login)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
#verifica el codigo del mail 
@router.post("/verify-email")
def verify_email(code: schemas.Verifycode, db: Session = Depends(get_db)):
    try:
        # Buscar el usuario por su correo electrónico en la base de datos
        user = db.query(models.User).filter(models.User.username == code.email).first()
        if not user:
            return JSONResponse(status_code=404, content={"detail": "User not found"})
        
        # Verificar si el código ingresado coincide con el código almacenado en la base de datos
        if user.verification_code != code.code:
            return JSONResponse(status_code=400, content={"detail": "Invalid verification code"})
        
        # Verificar si el código aún es válido (no ha expirado)
        if user.verification_expires_at and user.verification_expires_at < datetime.utcnow():
            # Si el código ha expirado, eliminar al usuario de la base de datos
            db.delete(user)
            db.commit()
            return JSONResponse(status_code=400, content={"detail": "Verification code has expired. User deleted."})
        
        # Actualizar el estado de verificación del usuario y guardar los cambios en la base de datos
        user.is_verified = True
        user.verification_code = None
        user.verification_expires_at = None
        db.commit()

        # Retornar una respuesta exitosa
        return JSONResponse(status_code=200, content={"message": "Email verified successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# Clave secreta para firmar el token JWT
SECRET_KEY = "Est&deberi@serun@c0digos3guro!#*"
# Algoritmo de encriptación
ALGORITHM = "HS256"
# Tiempo de expiración del token en minutos
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Función para crear un token JWT
def create_jwt_token(username: str):
    # Calcula la fecha y hora de expiración del token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Crea el payload del token con el nombre de usuario y la fecha de expiración
    payload = {"sub": username, "exp": expire}

    #Arriba en el payload se le deberían agregar los scopes o pantallas a las cuales puede tener acceso ese token.
    
    # Codifica el token con la clave secreta y el algoritmo especificado
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def generate_random_password():
    # Definir los caracteres permitidos para la contraseña
    characters = string.ascii_letters + string.digits + string.punctuation
    # Generar una contraseña aleatoria de longitud 12
    password = ''.join(random.choice(characters) for _ in range(12))
    return password

def send_new_password_email(username, new_password):
    # Configurar el servidor SMTP de Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # El puerto para SMTP en Gmail

    sender_email = "rocio.mendez@meetsuper.com"
    sender_password = "sagp xbyd gqtv aeog"

    # Configurar el correo electrónico del destinatario
    receiver_email = username

    # Crear el mensaje de correo electrónico
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = "Nueva contraseña para tu cuenta"

    # Crear el cuerpo del mensaje
    body = f"""
    ¡Hola!

    Debido a que ingresaste mal la contraseña varias veces se a generado automáticamente una nueva contraseña para tu cuenta.
    Tu nueva contraseña es: {new_password}

    Por favor, inicia sesión con esta nueva contraseña y considera cambiarla después de iniciar sesión.

    Saludos    
    """
    msg.attach(MIMEText(body, "plain"))

    # Iniciar sesión en el servidor SMTP y enviar el correo electrónico
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("New password email sent successfully")
    except Exception as e:
        print("Error sending new password email:", e)

MAX_LOGIN_ATTEMPTS = 4
# Endpoint para el inicio de sesión
@router.post("/login")
async def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Busca al usuario en la base de datos por nombre de usuario
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if existing_user:
                      
            # Verifica si el usuario está activo
            if existing_user.is_active:
                # Verifica si la cuenta está verificada
                if existing_user.is_verified:
                    # Verifica si la contraseña proporcionada coincide con la contraseña almacenada hasheada
                    if bcrypt.checkpw(user.password.encode('utf-8'), existing_user.password_hash.encode('utf-8')):
                        # Actualiza el timestamp de last_login con la fecha y hora actual
                        existing_user.last_login = datetime.utcnow()
                        # Restablece los intentos de inicio de sesión fallidos
                        existing_user.login_attempts = 0
                        existing_user.last_login_attempt = None
                        db.commit()
                        # Si las credenciales son válidas, genera un token JWT y lo devuelve
                        token = create_jwt_token(user.username)
                        return {"token": token, "token_type": "bearer"}
                    else:
                        # Si la contraseña no coincide, registra el intento de inicio de sesión fallido
                        existing_user.login_attempts += 1
                        existing_user.last_login_attempt = datetime.utcnow()
                        db.commit()
                        # Verifica si se superó el límite de intentos de inicio de sesión
                        if existing_user.login_attempts >= MAX_LOGIN_ATTEMPTS:
                            # Genera una nueva contraseña aleatoria para el usuario
                            new_password = generate_random_password()
                            # Hashea la nueva contraseña
                            hashed_password = hashpw(new_password.encode('utf-8'), gensalt())
                            # Actualiza la contraseña en la base de datos
                            existing_user.password_hash = hashed_password
                            # Restablece el contador de intentos de inicio de sesión fallidos a 0
                            existing_user.login_attempts = 0
                            db.commit()
                            # Envía la nueva contraseña al usuario por correo electrónico
                            send_new_password_email(existing_user.username, new_password)
                            return JSONResponse(status_code=401, content={"detail": "A new password has been sent to your email."})
                        return JSONResponse(status_code=401, content={"detail": "Invalid password"})
                else:
                    # Si la cuenta no está verificada, devuelve un error
                    return JSONResponse(status_code=401, content={"detail": "User account needs to be verified."})
                    
            else:
                # Si el usuario está desactivado, devuelve un error
                return JSONResponse(status_code=401, content={"detail": "User is deactivated"})

        else:
            # Si el usuario no existe, devuelve un error de autenticación
            return JSONResponse(status_code=401, content={"detail": "Invalid username"})
            
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

@router.put("/change-password/{username}")
async def change_password_for_user(user: schemas.ChangePassword, db: Session = Depends(get_db)):
    try:
        # Buscar al usuario por nombre de usuario en la base de datos
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if not existing_user:
            return JSONResponse(status_code=404, content={"detail": "User not found"})
        
        # Verificar si la contraseña actual coincide con la almacenada en la base de datos
        if not bcrypt.checkpw(user.current_password.encode('utf-8'), existing_user.password_hash.encode('utf-8')):
            return JSONResponse(status_code=401, content={"detail": "Invalid current password"})
        
        # Verifica si la nueva contraseña cumple con los requisitos
        if not re.match(r"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-+=])(?=\S+$).{8,}$", user.new_password):
            return JSONResponse(status_code=400, content={"detail": "Password requirements not met"})
        
        # Actualizar la contraseña del usuario en la base de datos
        hashed_password = hashpw(user.new_password.encode('utf-8'), gensalt())
        existing_user.password_hash = hashed_password
        db.commit()
        return JSONResponse(status_code=200, content={"message": "Password updated successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
    
@router.put("/forgot-password")
async def forgot_password_for_user(user: schemas.ForgotPassword, db: Session = Depends(get_db)):
    try:
        print(user.username)
        # Buscar al usuario por nombre de usuario en la base de datos
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if not existing_user:
            return JSONResponse(status_code=404, content={"detail": "User not found"})
        send_new_password_email(user.username, generate_random_password())
        return JSONResponse(status_code=200, content={"message": "Contraseña cambiada exitosamente"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
    
@router.delete("/users/")
async def deactivate_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Busca al usuario en la base de datos por su nombre de usuario
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if not existing_user:
            return JSONResponse(status_code=404, content={"detail": "User not found"})
        
        # Verifica si las credenciales proporcionadas coinciden con las del usuario
        if not bcrypt.checkpw(user.password.encode('utf-8'), existing_user.password_hash.encode('utf-8')):
            return JSONResponse(status_code=401, content={"detail": "Invalid credentials"})
        
        # Verifica si el usuario ya está desactivado
        if not existing_user.is_active:
            return JSONResponse(status_code=400, content={"detail": "User is already deactivated"})
        
        # Desactiva al usuario y guarda la fecha de desactivación
        existing_user.is_active = False
        existing_user.date_deactivated = datetime.utcnow()
        db.commit()
        
        return JSONResponse(status_code=200, content={"message": "User deactivated successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})