import os
import httpx
from fastapi import APIRouter, HTTPException
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])

STRAPI_URL = os.getenv("STRAPI_URL", "http://strapi:1337")


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{STRAPI_URL}/api/auth/local/register",
            json=payload.model_dump(),
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return response.json()


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{STRAPI_URL}/api/auth/local",
            json=payload.model_dump(),
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return response.json()