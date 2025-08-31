from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase import init_firebase

app = FastAPI()
db = init_firebase()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/recipes")
def get_recipes():
    recipes_ref = db.collection("recipes")
    docs = recipes_ref.stream()
    return [doc.to_dict() for doc in docs]
