from sqlalchemy import Column, Integer, String, DateTime, Boolean
from conexion import Base
from datetime import datetime, timedelta

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    date_created = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=None)
    is_active = Column(Boolean, default=True)
    date_deactivated = Column(DateTime, default=None)
    verification_code = Column(String(255), default=None)
    verification_expires_at = Column(DateTime, default=None)
    is_verified = Column(Boolean, default=False)
    login_attempts = Column(Integer, default=0)