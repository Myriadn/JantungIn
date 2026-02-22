from pydantic import BaseModel, Field


class DiagnosisInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    sex: str = Field(..., pattern="^(Male|Female)$")
    chestPainType: str = Field(
        ...,
        pattern="^(Typical angina|Atypical angina|Non-anginal pain|Asymptomatic)$",
    )
    restingBloodPressure: float = Field(..., gt=0)
    serumCholesterol: float = Field(..., ge=0)
    fastingBloodSugar: float = Field(..., ge=0)
    restingEcgResults: str = Field(
        ...,
        pattern="^(Normal|ST-T wave abnormality|Left ventricular hypertrophy)$",
    )
    maximumHeartRate: int = Field(..., ge=0)
    exerciseInducedAngina: str = Field(..., pattern="^(Yes|No)$")
    stDepression: float = Field(..., ge=0)
    stSegment: str = Field(..., pattern="^(Upsloping|Flat|Downsloping)$")
    majorVessels: int = Field(..., ge=0, le=3)
    thalassemia: str = Field(
        ...,
        pattern="^(Normal|Fixed defect|Reversible defect)$",
    )


class PredictionResult(BaseModel):
    resultPercentage: int
    cardiovascularRisk: str
    prediction: str


class PredictionResponse(BaseModel):
    success: bool
    message: str
    data: PredictionResult
