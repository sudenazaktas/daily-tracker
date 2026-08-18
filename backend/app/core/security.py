import os
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")

security_scheme = HTTPBearer()


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> int:
    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("userId")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token missing user id")

    return int(user_id)