# backend/app/utils/auth.py
import logging
import traceback
from typing import Optional
from fastapi import Header, HTTPException
from firebase_admin import auth

logger = logging.getLogger("uvicorn.error")

def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error("Token verification failed: %s", e)
        logger.exception(e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")
