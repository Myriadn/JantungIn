package usecase

import (
	"jantungin-api-server/internal/data/repository"
)

type DiagnosisUsecase interface {
	// Nanti fungsi SubmitDiagnosis dan GetUserDiagnosisHistory ditaruh di sini
}

type diagnosisUsecase struct {
	diagnosisRepo repository.DiagnosisRepository
}

func NewDiagnosisUsecase(diagnosisRepo repository.DiagnosisRepository) DiagnosisUsecase {
	return &diagnosisUsecase{
		diagnosisRepo: diagnosisRepo,
	}
}
