import json
import os
from typing import Optional

import numpy as np


class Predictor:
    """
    Singleton predictor.

    Load weights langsung dari file .bin (TF.js format) menggunakan numpy murni.
    Tidak memerlukan tensorflowjs maupun tensorflow — hanya numpy.

    Arsitektur model (dari model.json):
        Input(13) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid)

    Layout weights di group1-shard1of1.bin (float32, little-endian, urutan dari weightsManifest):
        dense_42/kernel : [13, 64]  = 832  values
        dense_42/bias   : [64]      = 64   values
        dense_43/kernel : [64, 32]  = 2048 values
        dense_43/bias   : [32]      = 32   values
        dense_44/kernel : [32, 1]   = 32   values
        dense_44/bias   : [1]       = 1    value
        Total                       = 3009 float32 = 12036 bytes
    """

    _instance: Optional["Predictor"] = None

    # Weights layer 1
    _w1: Optional[np.ndarray] = None  # shape (13, 64)
    _b1: Optional[np.ndarray] = None  # shape (64,)

    # Weights layer 2
    _w2: Optional[np.ndarray] = None  # shape (64, 32)
    _b2: Optional[np.ndarray] = None  # shape (32,)

    # Weights layer 3
    _w3: Optional[np.ndarray] = None  # shape (32, 1)
    _b3: Optional[np.ndarray] = None  # shape (1,)

    # Scaler parameters
    _scaler_mean: list[float] = []
    _scaler_scale: list[float] = []

    @classmethod
    def get_instance(cls) -> "Predictor":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load(self) -> None:
        model_dir = os.getenv("MODEL_PATH", "model")

        self._load_weights(model_dir)
        self._load_scaler(model_dir)

        print(f"[Predictor] Weights loaded from {model_dir}/group1-shard1of1.bin")
        print(f"[Predictor] Scaler loaded: {len(self._scaler_mean)} features")

    def _load_weights(self, model_dir: str) -> None:
        bin_path = os.path.join(model_dir, "group1-shard1of1.bin")

        with open(bin_path, "rb") as f:
            raw = np.frombuffer(f.read(), dtype=np.float32)

        offset = 0

        # Layer 1: Dense(64, relu)
        size = 13 * 64
        self._w1 = raw[offset : offset + size].reshape(13, 64).copy()
        offset += size

        size = 64
        self._b1 = raw[offset : offset + size].copy()
        offset += size

        # Layer 2: Dense(32, relu)
        size = 64 * 32
        self._w2 = raw[offset : offset + size].reshape(64, 32).copy()
        offset += size

        size = 32
        self._b2 = raw[offset : offset + size].copy()
        offset += size

        # Layer 3: Dense(1, sigmoid)
        size = 32 * 1
        self._w3 = raw[offset : offset + size].reshape(32, 1).copy()
        offset += size

        size = 1
        self._b3 = raw[offset : offset + size].copy()

    def _load_scaler(self, model_dir: str) -> None:
        scaler_path = os.path.join(model_dir, "scaler_info.json")

        with open(scaler_path, "r") as f:
            scaler_info = json.load(f)

        self._scaler_mean = scaler_info["mean"]
        self._scaler_scale = scaler_info["scale"]

    def is_loaded(self) -> bool:
        return self._w1 is not None

    def _forward(self, x: np.ndarray) -> float:
        # Layer 1: ReLU
        x = np.maximum(0.0, x @ self._w1 + self._b1)

        # Layer 2: ReLU
        x = np.maximum(0.0, x @ self._w2 + self._b2)

        # Layer 3: Sigmoid
        x = 1.0 / (1.0 + np.exp(-(x @ self._w3 + self._b3)))

        return float(x[0])

    def predict(self, features: list[float]) -> dict:
        if not self.is_loaded():
            raise RuntimeError("Model belum dimuat")

        # StandardScaler: (x - mean) / scale
        scaled = np.array(
            [
                (features[i] - self._scaler_mean[i]) / self._scaler_scale[i]
                for i in range(len(features))
            ],
            dtype=np.float32,
        )

        probability = self._forward(scaled)

        result_percentage = round(probability * 100)
        cardiovascular_risk = "High Risk" if probability >= 0.5 else "Low"
        prediction = "Berisiko" if probability >= 0.5 else "Tidak Berisiko"

        return {
            "resultPercentage": result_percentage,
            "cardiovascularRisk": cardiovascular_risk,
            "prediction": prediction,
        }
