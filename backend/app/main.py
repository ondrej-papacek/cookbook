from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import get_handler, patch_handler, delete_handler, post_handler

def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(get_handler.router)
    app.include_router(patch_handler.router)
    app.include_router(delete_handler.router)
    app.include_router(post_handler.router)

    return app

app = create_app()
