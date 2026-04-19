import logging
import os
import json

import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger("uvicorn.error")

db = None


def init_firebase():
    global db

    logger.info("Initializing Firebase...")

    firebase_key = os.getenv("FIREBASE_KEY_JSON")

    if firebase_key:
        # Production: key provided as JSON string in env var
        try:
            cred_dict = json.loads(firebase_key)
        except Exception:
            logger.exception("Failed to parse FIREBASE_KEY_JSON")
            raise
    else:
        # Local dev: load from firebase-key.json file
        key_path = os.path.join(os.path.dirname(__file__), "..", "..", "firebase-key.json")
        key_path = os.path.abspath(key_path)
        if not os.path.exists(key_path):
            raise RuntimeError(
                "No Firebase credentials found. Set FIREBASE_KEY_JSON env var "
                "or place firebase-key.json in backend/"
            )
        logger.info("Loading Firebase credentials from local file")
        with open(key_path) as f:
            cred_dict = json.load(f)

    try:
        cred = credentials.Certificate(cred_dict)
    except Exception:
        logger.exception("Error loading Firebase credentials")
        raise

    try:
        firebase_admin.get_app()
        logger.info("Firebase app already initialized")
    except ValueError:
        firebase_admin.initialize_app(cred)
        logger.info("Firebase app initialized")

    db = firestore.client()
    logger.info("Firebase client ready")


def get_db():
    """Return initialized Firestore client (lazy-init safe)."""
    global db
    if db is None:
        init_firebase()
    return db