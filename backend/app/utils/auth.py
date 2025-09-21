from fastapi import Depends, HTTPException
from firebase_admin import auth

def verify_token(authorization: str = Depends(lambda: None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
