import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

db = None

def init_firebase():
    global db

    print("Initializing Firebase...")

    firebase_key = os.getenv("FIREBASE_KEY_JSON")
    if not firebase_key:
        raise RuntimeError("Missing FIREBASE_KEY_JSON environment variable")

    try:
        cred_dict = json.loads(firebase_key)
        cred = credentials.Certificate(cred_dict)
        print("Firebase credentials loaded successfully")
    except Exception as e:
        print("Error loading Firebase credentials:", e)
        raise

    try:
        firebase_admin.get_app()
        print("Firebase app already initialized")
    except ValueError:
        firebase_admin.initialize_app(cred)
        print("Firebase app initialized")

    db = firestore.client()
    print("Firebase client ready")

def get_db():
    """Return initialized Firestore client (lazy-init safe)."""
    global db
    if db is None:
        init_firebase()
    return db
