import os
import httpx
from fastapi import APIRouter, HTTPException, Header
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])

STRAPI_URL = os.getenv("STRAPI_URL", "http://strapi:1337")

# Strapi ücretsiz Render'da uykuya geçince soğuk başlangıç ~80 sn sürebilir.
# Varsayılan 5 sn zaman aşımı buna yetmez; bu yüzden cömert bir süre veriyoruz.
STRAPI_TIMEOUT = httpx.Timeout(90.0, connect=90.0)


async def _call_strapi(method: str, path: str, **kwargs):
    """
    Strapi'ye istek atar ve yanıtı güvenli şekilde işler.
    Zaman aşımı/bağlantı hatası veya JSON olmayan yanıtta 500 yerine
    kullanıcıya anlamlı bir mesaj döner (özellikle Strapi uyanırken).
    """
    try:
        async with httpx.AsyncClient(timeout=STRAPI_TIMEOUT) as client:
            response = await client.request(method, f"{STRAPI_URL}{path}", **kwargs)
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Kimlik doğrulama servisi şu anda uyanıyor olabilir. Lütfen birkaç saniye sonra tekrar deneyin.",
        )

    if response.status_code != 200:
        try:
            detail = response.json()
        except Exception:
            detail = "Kimlik doğrulama servisine ulaşılamadı. Lütfen tekrar deneyin."
        raise HTTPException(status_code=response.status_code, detail=detail)

    try:
        return response.json()
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Kimlik doğrulama servisinden geçersiz yanıt alındı. Lütfen tekrar deneyin.",
        )


@router.get("/me")
async def me(authorization: str = Header(...)):
    """Giriş yapan kullanıcının bilgilerini Strapi'den getirir (JWT ile)."""
    return await _call_strapi(
        "GET", "/api/users/me", headers={"Authorization": authorization}
    )


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    return await _call_strapi(
        "POST", "/api/auth/local/register", json=payload.model_dump()
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    return await _call_strapi("POST", "/api/auth/local", json=payload.model_dump())


@router.post("/refresh")
async def refresh(payload: RefreshRequest):
    """Kısa ömürlü access token'ı, refresh token ile yeniler (Strapi refresh modu)."""
    return await _call_strapi(
        "POST", "/api/auth/refresh", json={"refreshToken": payload.refreshToken}
    )
