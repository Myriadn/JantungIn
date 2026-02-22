from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI

from app.model.predictor import Predictor
from app.routes.prediction import router as prediction_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model sekali saat startup, bukan setiap request
    predictor = Predictor.get_instance()
    predictor.load()
    yield
    # Cleanup jika diperlukan


app = FastAPI(
    title="JantungIn ML Service",
    version="1.0.0",
    docs_url="/docs",
    lifespan=lifespan,
)

app.include_router(prediction_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    predictor = Predictor.get_instance()
    return {
        "status": "ok",
        "model_loaded": predictor.is_loaded(),
    }


if __name__ == "__main__":
    import os

    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", 8001)),
        reload=True,
    )
