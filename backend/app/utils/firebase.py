import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

db = None

def init_firebase():
    global db

    print("Initializing Firebase...")

    firebase_key = os.getenv("FIREBASE_KEY_JSON")

    if firebase_key:
        # Production: key provided as JSON string in env var
        try:
            cred_dict = json.loads(firebase_key)
        except Exception as e:
            print("Error parsing FIREBASE_KEY_JSON:", e)
            raise
    else:
        # Local dev: load from firebase-key.json file
        key_path = os.path.join(os.path.dirname(__file__), "..", "..", "firebase-key.json")
        key_path = os.path.abspath(key_path)
        if not os.path.exists(key_path):
            raise RuntimeError(
                "No Firebase credentials found. Set FIREBASE_KEY_JSON env var "
                "or place firebase-key.json in backend/app/"
            )
        print(f"Loading Firebase credentials from {key_path}")
        with open(key_path) as f:
            cred_dict = json.load(f)

    try:
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
