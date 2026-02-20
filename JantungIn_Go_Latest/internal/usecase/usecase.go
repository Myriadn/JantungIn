package usecase

import (
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/pkg/utils"

	"gorm.io/gorm"
)

type UseCase struct {
	AuthUseCase      AuthUsecase
	DiagnosisUseCase DiagnosisUsecase
}

func NewUseCase(userRepo repository.UserRepository, diagnosisRepo repository.DiagnosisRepository, cfg *utils.Config, db *gorm.DB) *UseCase {
	return &UseCase{
		AuthUseCase:      NewAuthUsecase(userRepo, cfg),
		DiagnosisUseCase: NewDiagnosisUsecase(diagnosisRepo),
	}
}
