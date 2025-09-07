import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def init_firebase():
    firebase_key = os.getenv("FIREBASE_KEY_JSON")

    if not firebase_key:
        raise RuntimeError("Missing FIREBASE_KEY_JSON environment variable")

    cred_dict = json.loads(firebase_key)
    cred = credentials.Certificate(cred_dict)

    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(cred)

    return firestore.client()

db = init_firebase()
