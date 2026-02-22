from fastapi import APIRouter, HTTPException

from app.model.predictor import Predictor
from app.schemas.prediction import DiagnosisInput, PredictionResponse

router = APIRouter()

# Mapping categorical fields ke nilai numerik (sesuai legacy + scaler feature names)
_SEX_MAP = {"Male": 1, "Female": 0}
_CP_MAP = {
    "Typical angina": 1,
    "Atypical angina": 2,
    "Non-anginal pain": 3,
    "Asymptomatic": 4,
}
_RESTECG_MAP = {
    "Normal": 0,
    "ST-T wave abnormality": 1,
    "Left ventricular hypertrophy": 2,
}
_EXANG_MAP = {"Yes": 1, "No": 0}
_SLOPE_MAP = {"Upsloping": 1, "Flat": 2, "Downsloping": 3}
_THAL_MAP = {"Normal": 3, "Fixed defect": 6, "Reversible defect": 7}


def _map_to_features(data: DiagnosisInput) -> list[float]:
    """
    Konversi DiagnosisInput ke array numerik sesuai urutan feature_names
    di scaler_info.json: age, sex, cp, trestbps, chol, fbs, restecg,
    thalach, exang, oldpeak, slope, ca, thal
    """
    return [
        float(data.age),
        float(_SEX_MAP[data.sex]),
        float(_CP_MAP[data.chestPainType]),
        float(data.restingBloodPressure),
        float(data.serumCholesterol),
        float(1 if data.fastingBloodSugar > 120 else 0),
        float(_RESTECG_MAP[data.restingEcgResults]),
        float(data.maximumHeartRate),
        float(_EXANG_MAP[data.exerciseInducedAngina]),
        float(data.stDepression),
        float(_SLOPE_MAP[data.stSegment]),
        float(data.majorVessels),
        float(_THAL_MAP[data.thalassemia]),
    ]


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: DiagnosisInput):
    predictor = Predictor.get_instance()

    if not predictor.is_loaded():
        raise HTTPException(status_code=503, detail="Model belum siap")

    features = _map_to_features(payload)
    result = predictor.predict(features)

    return PredictionResponse(
        success=True,
        message="Prediction successful",
        data=result,
    )
