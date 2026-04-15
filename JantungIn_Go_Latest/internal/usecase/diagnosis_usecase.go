package usecase

import (
	"context"
	"errors"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/internal/dto"
	"jantungin-api-server/internal/services"
	"jantungin-api-server/pkg/utils"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type DiagnosisUsecase interface {
	CreateDiagnosis(ctx context.Context, creatorID string, req dto.CreateDiagnosisRequest) (*dto.DiagnosisResultData, error)
	GetDiagnosisHistory(ctx context.Context, userID string, role string, patientID string) ([]entity.Diagnosis, error)
	GetDiagnosisByID(ctx context.Context, userID string, role string, diagnosisID string) (*entity.Diagnosis, error)
	GetAllDiagnoses(ctx context.Context) ([]entity.Diagnosis, error)
	GetPatientDiagnoses(ctx context.Context, patientID string) ([]entity.Diagnosis, error)
}

type diagnosisUsecase struct {
	diagnosisRepo repository.DiagnosisRepository
	userRepo      repository.UserRepository
	mlClient      *services.MLClient
}

func NewDiagnosisUsecase(
	diagnosisRepo repository.DiagnosisRepository,
	userRepo repository.UserRepository,
	mlClient *services.MLClient,
) DiagnosisUsecase {
	return &diagnosisUsecase{
		diagnosisRepo: diagnosisRepo,
		userRepo:      userRepo,
		mlClient:      mlClient,
	}
}

func (u *diagnosisUsecase) CreateDiagnosis(ctx context.Context, creatorID string, req dto.CreateDiagnosisRequest) (*dto.DiagnosisResultData, error) {
	creatorUID, err := uuid.Parse(creatorID)
	if err != nil {
		return nil, errors.New("invalid creator ID")
	}

	userUID := creatorUID
	if req.PatientID != "" {
		parsed, err := uuid.Parse(req.PatientID)
		if err != nil {
			return nil, errors.New("invalid patient ID")
		}

		// Pastikan pasien ada
		patient, err := u.userRepo.FindByID(ctx, parsed)
		if err != nil {
			return nil, err
		}
		if patient == nil {
			return nil, errors.New("pasien tidak ditemukan")
		}

		userUID = parsed
	}

	// Panggil ML service
	mlReq := services.MLPredictRequest{
		Age:                   req.Age,
		Sex:                   req.Sex,
		ChestPainType:         req.ChestPainType,
		RestingBloodPressure:  req.RestingBloodPressure,
		SerumCholesterol:      req.SerumCholesterol,
		FastingBloodSugar:     req.FastingBloodSugar,
		RestingEcgResults:     req.RestingEcgResults,
		MaximumHeartRate:      req.MaximumHeartRate,
		ExerciseInducedAngina: req.ExerciseInducedAngina,
		StDepression:          req.StDepression,
		StSegment:             req.StSegment,
		MajorVessels:          req.MajorVessels,
		Thalassemia:           req.Thalassemia,
	}

	mlResult, err := u.mlClient.Predict(ctx, mlReq)
	if err != nil {
		utils.Error("ML service prediction failed", zap.Error(err))
		return nil, errors.New("gagal melakukan prediksi")
	}

	// Simpan ke database
	diagnosis := &entity.Diagnosis{
		UserID:                userUID,
		CreatedBy:             &creatorUID,
		Age:                   req.Age,
		Sex:                   req.Sex,
		ChestPainType:         req.ChestPainType,
		RestingEcgResults:     req.RestingEcgResults,
		FastingBloodSugar:     req.FastingBloodSugar,
		RestingBloodPressure:  req.RestingBloodPressure,
		MaximumHeartRate:      req.MaximumHeartRate,
		ExerciseInducedAngina: req.ExerciseInducedAngina,
		StSegment:             req.StSegment,
		MajorVessels:          req.MajorVessels,
		Thalassemia:           req.Thalassemia,
		SerumCholesterol:      req.SerumCholesterol,
		StDepression:          req.StDepression,
		ResultPercentage:      float64(mlResult.ResultPercentage),
		CardiovascularRisk:    mlResult.CardiovascularRisk,
		Prediction:            mlResult.Prediction,
	}

	if err := u.diagnosisRepo.Create(ctx, diagnosis); err != nil {
		utils.Error("Failed to save diagnosis", zap.Error(err))
		return nil, errors.New("gagal menyimpan diagnosis")
	}

	utils.Info("Diagnosis created",
		zap.String("diagnosis_id", diagnosis.ID.String()),
		zap.String("patient_id", userUID.String()),
		zap.String("created_by", creatorID),
		zap.String("prediction", mlResult.Prediction),
	)

	return &dto.DiagnosisResultData{
		ID:                 diagnosis.ID.String(),
		UserID:             userUID.String(),
		ResultPercentage:   float64(mlResult.ResultPercentage),
		CardiovascularRisk: mlResult.CardiovascularRisk,
		Prediction:         mlResult.Prediction,
		CreatedAt:          diagnosis.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}, nil
}

func (u *diagnosisUsecase) GetDiagnosisHistory(ctx context.Context, userID string, role string, patientID string) ([]entity.Diagnosis, error) {
	// Admin/dokter bisa lihat history pasien lain via query param ?patientId=
	targetID := userID
	if (role == "admin" || role == "dokter") && patientID != "" {
		targetID = patientID
	}

	uid, err := uuid.Parse(targetID)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	return u.diagnosisRepo.FindByPatientID(ctx, uid)
}

func (u *diagnosisUsecase) GetDiagnosisByID(ctx context.Context, userID string, role string, diagnosisID string) (*entity.Diagnosis, error) {
	did, err := uuid.Parse(diagnosisID)
	if err != nil {
		return nil, errors.New("invalid diagnosis ID")
	}

	diagnosis, err := u.diagnosisRepo.FindByID(ctx, did)
	if err != nil {
		return nil, err
	}
	if diagnosis == nil {
		return nil, errors.New("diagnosis not found")
	}

	// Pasien hanya bisa lihat diagnosis miliknya sendiri
	if role != "admin" && role != "dokter" {
		if diagnosis.UserID.String() != userID {
			return nil, errors.New("diagnosis not found")
		}
	}

	return diagnosis, nil
}

func (u *diagnosisUsecase) GetAllDiagnoses(ctx context.Context) ([]entity.Diagnosis, error) {
	return u.diagnosisRepo.FindAll(ctx)
}

func (u *diagnosisUsecase) GetPatientDiagnoses(ctx context.Context, patientID string) ([]entity.Diagnosis, error) {
	uid, err := uuid.Parse(patientID)
	if err != nil {
		return nil, errors.New("invalid patient ID")
	}

	patient, err := u.userRepo.FindByID(ctx, uid)
	if err != nil {
		return nil, err
	}
	if patient == nil {
		return nil, errors.New("pasien tidak ditemukan")
	}

	return u.diagnosisRepo.FindByPatientID(ctx, uid)
}
