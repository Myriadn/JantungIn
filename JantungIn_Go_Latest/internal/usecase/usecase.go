package usecase

import (
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/internal/services"
	"jantungin-api-server/pkg/utils"

	"gorm.io/gorm"
)

type UseCase struct {
	AuthUseCase      AuthUsecase
	DiagnosisUseCase DiagnosisUsecase
	StatsUseCase     StatsUsecase
	PatientUseCase   PatientUsecase
}

func NewUseCase(userRepo repository.UserRepository, diagnosisRepo repository.DiagnosisRepository, statsRepo repository.StatsRepository, cfg *utils.Config, db *gorm.DB) *UseCase {
	mlClient := services.NewMLClient(cfg.App.MLServiceURL)

	return &UseCase{
		AuthUseCase:      NewAuthUsecase(userRepo, cfg),
		DiagnosisUseCase: NewDiagnosisUsecase(diagnosisRepo, userRepo, mlClient),
		StatsUseCase:     NewStatsUsecase(statsRepo),
		PatientUseCase:   NewPatientUsecase(userRepo),
	}
}
