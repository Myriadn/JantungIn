package usecase

import (
	"context"
	"errors"
	"strings"
	"time"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/internal/dto"
	"jantungin-api-server/pkg/utils"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Register(ctx context.Context, req dto.AuthRegisterRequest) (*dto.AuthRegisterData, error)
	Login(ctx context.Context, req dto.AuthLoginRequest, userAgent, ipAddress, deviceFingerprint string) (*dto.AuthLoginData, error)
	LoginWithEmail(ctx context.Context, req dto.AuthLoginEmailRequest, userAgent, ipAddress, deviceFingerprint string) (*dto.AuthLoginData, error)
	GetProfile(ctx context.Context, userID string) (*dto.AuthUserResponse, error)
	UpdateProfile(ctx context.Context, userID string, req dto.UpdateProfileRequest) (*dto.UpdateProfileData, error)
}

type authUsecase struct {
	userRepo       repository.UserRepository
	userDeviceRepo repository.UserDeviceRepository
	cfg            *utils.Config
}

func NewAuthUsecase(userRepo repository.UserRepository, userDeviceRepo repository.UserDeviceRepository, cfg *utils.Config) AuthUsecase {
	return &authUsecase{
		userRepo:       userRepo,
		userDeviceRepo: userDeviceRepo,
		cfg:            cfg,
	}
}

func (u *authUsecase) Register(ctx context.Context, req dto.AuthRegisterRequest) (*dto.AuthRegisterData, error) {
	username := strings.ToLower(strings.TrimSpace(req.Username))
	if username == "" {
		return nil, errors.New("username wajib diisi")
	}
	if len(username) < 3 {
		return nil, errors.New("username minimal 3 karakter")
	}

	if len(req.Password) < 6 {
		return nil, errors.New("password minimal 6 karakter")
	}

	existingUser, err := u.userRepo.FindByUsername(ctx, username)
	if err != nil {
		utils.Error("Failed to check username", zap.Error(err))
		return nil, errors.New("gagal memeriksa username")
	}
	if existingUser != nil {
		return nil, errors.New("username sudah terdaftar")
	}

	normalizedEmail := strings.ToLower(strings.TrimSpace(req.Email))

	// Cek email jika diisi
	if normalizedEmail != "" {
		existingUserByEmail, err := u.userRepo.FindByEmail(ctx, normalizedEmail)
		if err != nil {
			utils.Error("Failed to check email", zap.Error(err))
			return nil, errors.New("gagal memeriksa email")
		}
		if existingUserByEmail != nil {
			return nil, errors.New("email sudah terdaftar")
		}
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.Error("Failed to hash password", zap.Error(err))
		return nil, errors.New("gagal memproses password")
	}

	var dob *time.Time
	if req.DateOfBirth != "" {
		parsedDate, parseErr := time.Parse("2006-01-02", req.DateOfBirth)
		if parseErr != nil {
			return nil, errors.New("format tanggal lahir tidak valid, gunakan YYYY-MM-DD")
		}
		dob = &parsedDate
	}

	displayName := strings.TrimSpace(req.Name)
	if displayName == "" {
		displayName = username
	}

	newUser := entity.User{
		Name:        displayName,
		Username:    &username,
		Password:    string(hashedPassword),
		Role:        "user",
		DateOfBirth: dob,
	}
	if normalizedEmail != "" {
		newUser.Email = &normalizedEmail
	}

	if err := u.userRepo.Create(ctx, &newUser); err != nil {
		utils.Error("Failed to create user", zap.Error(err))
		return nil, errors.New("gagal membuat akun")
	}

	// Generate JWT token
	token, err := u.generateToken(&newUser)
	if err != nil {
		utils.Error("Failed to generate token after registration", zap.Error(err))
		return nil, errors.New("registrasi berhasil tetapi gagal membuat token")
	}

	utils.Info("User registered successfully",
		zap.String("user_id", newUser.ID.String()),
		zap.String("role", newUser.Role),
	)

	return &dto.AuthRegisterData{
		ID:       newUser.ID.String(),
		Name:     newUser.Name,
		Username: newUser.Username,
		Email:    newUser.Email,
		Role:     newUser.Role,
		Token:    token,
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, req dto.AuthLoginRequest, userAgent, ipAddress, deviceFingerprint string) (*dto.AuthLoginData, error) {
	username := strings.ToLower(strings.TrimSpace(req.Username))
	if username == "" {
		return nil, errors.New("username wajib diisi")
	}

	foundUser, err := u.userRepo.FindByUsername(ctx, username)
	if err != nil {
		utils.Error("Failed to find user by username", zap.Error(err))
		return nil, errors.New("username atau password tidak valid")
	}
	if foundUser == nil {
		utils.Warn("No user found with matching username")
		return nil, errors.New("username atau password tidak valid")
	}

	// Verifikasi password
	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(req.Password)); err != nil {
		utils.Warn("Password verification failed",
			zap.String("user_id", foundUser.ID.String()),
		)
		return nil, errors.New("username atau password tidak valid")
	}

	// Generate JWT token
	token, err := u.generateToken(foundUser)
	if err != nil {
		utils.Error("Failed to generate token", zap.Error(err))
		return nil, errors.New("gagal membuat token")
	}

	// Track device login (non-blocking: log errors but don't fail the login)
	if err := u.userDeviceRepo.CreateOrUpdate(ctx, foundUser.ID, userAgent, ipAddress, deviceFingerprint); err != nil {
		utils.Warn("Failed to track device login",
			zap.String("user_id", foundUser.ID.String()),
			zap.Error(err),
		)
	}

	utils.Info("User logged in successfully",
		zap.String("user_id", foundUser.ID.String()),
		zap.String("role", foundUser.Role),
	)

	return &dto.AuthLoginData{
		ID:       foundUser.ID.String(),
		Name:     foundUser.Name,
		Username: foundUser.Username,
		Email:    foundUser.Email,
		Role:     foundUser.Role,
		Token:    token,
	}, nil
}

func (u *authUsecase) LoginWithEmail(ctx context.Context, req dto.AuthLoginEmailRequest, userAgent, ipAddress, deviceFingerprint string) (*dto.AuthLoginData, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		utils.Error("Failed to find user by email", zap.Error(err))
		return nil, errors.New("email atau password tidak valid")
	}
	if user == nil {
		utils.Warn("No user found with email", zap.String("email", email))
		return nil, errors.New("email atau password tidak valid")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.Warn("Password verification failed for email login",
			zap.String("user_id", user.ID.String()),
		)
		return nil, errors.New("email atau password tidak valid")
	}

	token, err := u.generateToken(user)
	if err != nil {
		utils.Error("Failed to generate token", zap.Error(err))
		return nil, errors.New("gagal membuat token")
	}

	// Track device login (non-blocking: log errors but don't fail the login)
	if err := u.userDeviceRepo.CreateOrUpdate(ctx, user.ID, userAgent, ipAddress, deviceFingerprint); err != nil {
		utils.Warn("Failed to track device login",
			zap.String("user_id", user.ID.String()),
			zap.Error(err),
		)
	}

	utils.Info("User logged in with email successfully",
		zap.String("user_id", user.ID.String()),
		zap.String("role", user.Role),
	)

	return &dto.AuthLoginData{
		ID:       user.ID.String(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		Token:    token,
	}, nil
}

func (u *authUsecase) GetProfile(ctx context.Context, userID string) (*dto.AuthUserResponse, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	user, err := u.userRepo.FindByID(ctx, uid)
	if err != nil {
		utils.Error("Failed to find user by ID", zap.Error(err))
		return nil, errors.New("gagal mengambil profil")
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	return &dto.AuthUserResponse{
		ID:       user.ID.String(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
	}, nil
}

func (u *authUsecase) UpdateProfile(ctx context.Context, userID string, req dto.UpdateProfileRequest) (*dto.UpdateProfileData, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	user, err := u.userRepo.FindByID(ctx, uid)
	if err != nil {
		utils.Error("Failed to find user by ID", zap.Error(err))
		return nil, errors.New("gagal mengambil profil")
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.DateOfBirth != "" {
		parsedDate, parseErr := time.Parse("2006-01-02", req.DateOfBirth)
		if parseErr != nil {
			return nil, errors.New("format tanggal lahir tidak valid, gunakan YYYY-MM-DD")
		}
		user.DateOfBirth = &parsedDate
	}

	if err := u.userRepo.Update(ctx, user); err != nil {
		utils.Error("Failed to update user", zap.Error(err))
		return nil, errors.New("gagal memperbarui profil")
	}

	utils.Info("User profile updated",
		zap.String("user_id", user.ID.String()),
	)

	result := &dto.UpdateProfileData{
		ID:       user.ID.String(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
	}
	if user.DateOfBirth != nil {
		formatted := user.DateOfBirth.Format("2006-01-02")
		result.DateOfBirth = &formatted
	}

	return result, nil
}

// generateToken membuat JWT access token dari data user
func (u *authUsecase) generateToken(user *entity.User) (string, error) {
	email := ""
	if user.Email != nil {
		email = *user.Email
	}

	return utils.GenerateAccessToken(
		user.ID.String(),
		email,
		user.Role, // RoleID diisi dengan role string
		user.Role, // RoleCode diisi dengan role string
		u.cfg,
	)
}
