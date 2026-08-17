from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    identifier: str
    password: str


class AuthResponse(BaseModel):
    jwt: str
    refreshToken: Optional[str] = None
    user: dict