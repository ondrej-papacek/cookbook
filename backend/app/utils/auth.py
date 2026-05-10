# backend/app/utils/auth.py
import logging
import os
from typing import Optional
from fastapi import Header, HTTPException, Request
from firebase_admin import auth

logger = logging.getLogger("uvicorn.error")


def _load_allowed_emails() -> set[str]:
    raw = os.getenv("ALLOWED_USER_EMAILS", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def verify_token(
    request: Request,
    authorization: Optional[str] = Header(None),
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded_token = auth.verify_id_token(token)
    except Exception as e:
        # Don't log full traceback — leaks details into logs on every probe.
        logger.warning("Token verification failed: %s", type(e).__name__)
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Enforce allowlist: only specific emails may use the API. Protects against
    # anyone who signs up in Firebase (valid token does not imply authorized user).
    # Re-read the env var each time so operators can add users without restart.
    allowed = _load_allowed_emails()
    if allowed:
        email = (decoded_token.get("email") or "").lower()
        email_verified = bool(decoded_token.get("email_verified"))
        # email_verified check disabled: the shared account uses a fictional
        # address, so Firebase can't send a verification email. The allowlist
        # above is the real security gate. Re-enable by adding `or not
        # email_verified` to the condition below.
        if not email or email not in allowed:
            logger.warning(
                "Rejected unauthorized user: email=%s verified=%s",
                email or "<none>", email_verified,
            )
            raise HTTPException(status_code=403, detail="Not authorized")

    # Expose to downstream deps (rate limiter, handlers) without re-verifying.
    request.state.user = decoded_token
    return decoded_token