package usecase

import (
	"context"
	"errors"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/internal/data/repository"

	"github.com/google/uuid"
)

type PatientUsecase interface {
	GetAllPatients(ctx context.Context) ([]entity.User, error)
	GetPatientByID(ctx context.Context, id string) (*entity.User, error)
	SearchPatients(ctx context.Context, query string) ([]entity.User, error)
}

type patientUsecase struct {
	userRepo repository.UserRepository
}

func NewPatientUsecase(userRepo repository.UserRepository) PatientUsecase {
	return &patientUsecase{userRepo: userRepo}
}

func (u *patientUsecase) GetAllPatients(ctx context.Context) ([]entity.User, error) {
	return u.userRepo.FindAllByRole(ctx, "user")
}

func (u *patientUsecase) GetPatientByID(ctx context.Context, id string) (*entity.User, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid patient ID")
	}

	user, err := u.userRepo.FindByID(ctx, uid)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("patient not found")
	}

	return user, nil
}

func (u *patientUsecase) SearchPatients(ctx context.Context, query string) ([]entity.User, error) {
	if query == "" {
		return []entity.User{}, nil
	}
	return u.userRepo.SearchByName(ctx, query)
}
