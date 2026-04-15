package adaptor

import (
	"jantungin-api-server/internal/usecase"
)

type Adaptor struct {
	AuthAdaptor      *AuthAdaptor
	DiagnosisAdaptor *DiagnosisAdaptor
	StatsAdaptor     *StatsAdaptor
	PatientAdaptor   *PatientAdaptor
}

func NewAdaptor(usecases *usecase.UseCase) *Adaptor {
	return &Adaptor{
		AuthAdaptor:      NewAuthAdaptor(usecases.AuthUseCase),
		DiagnosisAdaptor: NewDiagnosisAdaptor(usecases.DiagnosisUseCase),
		StatsAdaptor:     NewStatsAdaptor(usecases.StatsUseCase),
		PatientAdaptor:   NewPatientAdaptor(usecases.PatientUseCase),
	}
}
