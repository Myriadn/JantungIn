package adaptor

import (
	"jantungin-api-server/internal/usecase"
)

type Adaptor struct {
	AuthAdaptor *AuthAdaptor
}

func NewAdaptor(usecases *usecase.UseCase) *Adaptor {
	return &Adaptor{
		AuthAdaptor: NewAuthAdaptor(usecases.AuthUseCase),
	}
}
