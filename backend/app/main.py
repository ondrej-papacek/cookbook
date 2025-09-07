from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.utils.firebase import init_firebase
from app.routes import get_handler, patch_handler, delete_handler, post_handler

@asynccontextmanager
async def lifespan(_: FastAPI):
    init_firebase()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"ok": True}

@app.get("/healthz")
@app.get("/healthZ")
def healthz():
    return {"status": "ok"}

app.include_router(get_handler.router)
app.include_router(patch_handler.router)
app.include_router(delete_handler.router)
app.include_router(post_handler.router)
