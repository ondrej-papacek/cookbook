"""SSRF guard for server-side URL fetches.

Blocks non-http(s) schemes and any hostname that resolves to a private,
loopback, link-local, or cloud-metadata address. Used by /api/import-recipe,
where the server fetches a client-supplied URL.
"""
import ipaddress
import socket
from urllib.parse import urlparse
from fastapi import HTTPException


_ALLOWED_SCHEMES = {"http", "https"}
_BLOCKED_HOSTS = {"metadata.google.internal"}


def _is_blocked_ip(ip: ipaddress._BaseAddress) -> bool:
    # Covers private (RFC1918), loopback, link-local, reserved, multicast,
    # unspecified (0.0.0.0 / ::), site-local (IPv6 ULA includes .is_private).
    return (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_reserved
        or ip.is_multicast
        or ip.is_unspecified
    )


def validate_external_url(url: str) -> str:
    """Raise HTTPException(400) unless url is a safe external http(s) URL."""
    if not url or len(url) > 2048:
        raise HTTPException(status_code=400, detail="Invalid URL")

    try:
        parsed = urlparse(url)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid URL")

    if parsed.scheme.lower() not in _ALLOWED_SCHEMES:
        raise HTTPException(status_code=400, detail="Only http(s) URLs are allowed")

    host = (parsed.hostname or "").lower()
    if not host:
        raise HTTPException(status_code=400, detail="URL has no host")

    if host in _BLOCKED_HOSTS:
        raise HTTPException(status_code=400, detail="URL host is not allowed")

    # Resolve every A/AAAA record; reject if ANY resolved address is internal.
    # Prevents DNS rebinding tricks where one A record is public, another private.
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        raise HTTPException(status_code=400, detail="Could not resolve URL host")

    for info in infos:
        addr = info[4][0]
        try:
            ip = ipaddress.ip_address(addr)
        except ValueError:
            continue
        if _is_blocked_ip(ip):
            raise HTTPException(status_code=400, detail="URL points to a non-public address")

    return url