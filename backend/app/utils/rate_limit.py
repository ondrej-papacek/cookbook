"""Shared rate limiter.

Keys requests by authenticated Firebase UID when present, falling back to
client IP. This means a single attacker can't bypass limits by rotating
tokens while keeping one IP, and legit users sharing a NAT aren't punished
for each other's usage.
"""
from typing import Optional
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


def _key_func(request: Request) -> str:
    # verify_token stores decoded claims on request.state when it runs.
    user = getattr(request.state, "user", None)
    if isinstance(user, dict):
        uid: Optional[str] = user.get("uid") or user.get("user_id")
        if uid:
            return f"uid:{uid}"
    return f"ip:{get_remote_address(request)}"


limiter = Limiter(key_func=_key_func, default_limits=["60/minute"])