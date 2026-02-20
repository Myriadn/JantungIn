package usecase

import (
	"context"
	"errors"
	"time"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/internal/dto"
	"jantungin-api-server/pkg/utils"

	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Register(ctx context.Context, req dto.AuthRegisterRequest) error
	Login(ctx context.Context, req dto.AuthLoginRequest) (string, error)
}

type authUsecase struct {
	userRepo repository.UserRepository
}

func NewAuthUsecase(userRepo repository.UserRepository) AuthUsecase {
	return &authUsecase{userRepo: userRepo}
}

func (u *authUsecase) Register(ctx context.Context, req dto.AuthRegisterRequest) error {
	secretKey := "12345678901234567890123456789012"
	encryptedNIK, err := utils.EncryptNIK(req.NIK, secretKey)
	if err != nil {
		return errors.New("gagal mengenkripsi NIK")
	}

	existingUser, err := u.userRepo.FindByNIK(ctx, encryptedNIK)
	if err != nil {
		return err
	}
	if existingUser != nil {
		return errors.New("NIK sudah terdaftar")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("gagal memproses password")
	}

	var dob *time.Time
	if req.DateOfBirth != "" {
		parsedDate, _ := time.Parse("2006-01-02", req.DateOfBirth)
		dob = &parsedDate
	}

	newUser := entity.User{
		Name:         req.Name,
		NIKEncrypted: encryptedNIK,
		Password:     string(hashedPassword),
		Role:         "user",
		DateOfBirth:  dob,
	}
	if req.Email != "" {
		newUser.Email = &req.Email
	}

	return u.userRepo.Create(ctx, &newUser)
}

func (u *authUsecase) Login(ctx context.Context, req dto.AuthLoginRequest) (string, error) {
	secretKey := "12345678901234567890123456789012"
	encryptedNIK, err := utils.EncryptNIK(req.NIK, secretKey)
	if err != nil {
		return "", errors.New("gagal mengenkripsi NIK")
	}

	user, err := u.userRepo.FindByNIK(ctx, encryptedNIK)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("NIK atau password salah")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return "", errors.New("NIK atau password salah")
	}

	token := "dummy_jwt_token_sementara"
	return token, nil
}
