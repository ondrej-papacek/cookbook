import firebase_admin
from firebase_admin import credentials, firestore

def init_firebase():
    cred = credentials.Certificate("firebase-key.json")
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    return firestore.client()
