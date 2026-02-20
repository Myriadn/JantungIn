package usecase

import (
	"context"
	"errors"
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
	Login(ctx context.Context, req dto.AuthLoginRequest) (*dto.AuthLoginData, error)
	LoginWithEmail(ctx context.Context, req dto.AuthLoginEmailRequest) (*dto.AuthLoginData, error)
	GetProfile(ctx context.Context, userID string) (*dto.AuthUserResponse, error)
	UpdateProfile(ctx context.Context, userID string, req dto.UpdateProfileRequest) (*dto.UpdateProfileData, error)
}

type authUsecase struct {
	userRepo repository.UserRepository
	cfg      *utils.Config
}

func NewAuthUsecase(userRepo repository.UserRepository, cfg *utils.Config) AuthUsecase {
	return &authUsecase{
		userRepo: userRepo,
		cfg:      cfg,
	}
}

func (u *authUsecase) Register(ctx context.Context, req dto.AuthRegisterRequest) (*dto.AuthRegisterData, error) {
	if len(req.NIK) != 16 {
		return nil, errors.New("NIK harus 16 digit angka")
	}
	for _, c := range req.NIK {
		if c < '0' || c > '9' {
			return nil, errors.New("NIK harus 16 digit angka")
		}
	}

	if len(req.Password) < 6 {
		return nil, errors.New("password minimal 6 karakter")
	}

	encryptionKey := u.cfg.App.EncryptionKey

	// Cek apakah NIK sudah terdaftar dengan mendekripsi semua user
	nikRegistered, err := u.isNIKRegistered(ctx, req.NIK, encryptionKey)
	if err != nil {
		utils.Error("Failed to check NIK registration", zap.Error(err))
		return nil, errors.New("gagal memeriksa NIK")
	}
	if nikRegistered {
		return nil, errors.New("NIK sudah terdaftar. Setiap NIK hanya dapat digunakan sekali.")
	}

	// Cek email jika diisi
	if req.Email != "" {
		existingUser, err := u.userRepo.FindByEmail(ctx, req.Email)
		if err != nil {
			utils.Error("Failed to check email", zap.Error(err))
			return nil, errors.New("gagal memeriksa email")
		}
		if existingUser != nil {
			return nil, errors.New("email sudah terdaftar")
		}
	}

	// Enkripsi NIK
	encryptedNIK, err := utils.EncryptNIK(req.NIK, encryptionKey)
	if err != nil {
		utils.Error("Failed to encrypt NIK", zap.Error(err))
		return nil, errors.New("gagal mengenkripsi NIK")
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
		ID:    newUser.ID.String(),
		Name:  newUser.Name,
		Email: newUser.Email,
		Role:  newUser.Role,
		Token: token,
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, req dto.AuthLoginRequest) (*dto.AuthLoginData, error) {
	if len(req.NIK) != 16 {
		return nil, errors.New("NIK harus 16 digit angka")
	}
	for _, c := range req.NIK {
		if c < '0' || c > '9' {
			return nil, errors.New("NIK harus 16 digit angka")
		}
	}

	encryptionKey := u.cfg.App.EncryptionKey

	// Ambil semua user dan dekripsi NIK untuk mencari yang cocok (sama seperti legacy)
	foundUser, err := u.findUserByNIK(ctx, req.NIK, encryptionKey)
	if err != nil {
		utils.Error("Failed to find user by NIK", zap.Error(err))
		return nil, errors.New("NIK atau password tidak valid")
	}
	if foundUser == nil {
		utils.Warn("No user found with matching NIK")
		return nil, errors.New("NIK atau password tidak valid")
	}

	// Verifikasi password
	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(req.Password)); err != nil {
		utils.Warn("Password verification failed",
			zap.String("user_id", foundUser.ID.String()),
		)
		return nil, errors.New("NIK atau password tidak valid")
	}

	// Generate JWT token
	token, err := u.generateToken(foundUser)
	if err != nil {
		utils.Error("Failed to generate token", zap.Error(err))
		return nil, errors.New("gagal membuat token")
	}

	utils.Info("User logged in successfully",
		zap.String("user_id", foundUser.ID.String()),
		zap.String("role", foundUser.Role),
	)

	return &dto.AuthLoginData{
		ID:    foundUser.ID.String(),
		Name:  foundUser.Name,
		Email: foundUser.Email,
		Role:  foundUser.Role,
		Token: token,
	}, nil
}

func (u *authUsecase) LoginWithEmail(ctx context.Context, req dto.AuthLoginEmailRequest) (*dto.AuthLoginData, error) {
	user, err := u.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		utils.Error("Failed to find user by email", zap.Error(err))
		return nil, errors.New("email atau password tidak valid")
	}
	if user == nil {
		utils.Warn("No user found with email", zap.String("email", req.Email))
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

	utils.Info("User logged in with email successfully",
		zap.String("user_id", user.ID.String()),
		zap.String("role", user.Role),
	)

	return &dto.AuthLoginData{
		ID:    user.ID.String(),
		Name:  user.Name,
		Email: user.Email,
		Role:  user.Role,
		Token: token,
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
		ID:    user.ID.String(),
		Name:  user.Name,
		Email: user.Email,
		Role:  user.Role,
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
		ID:    user.ID.String(),
		Name:  user.Name,
		Email: user.Email,
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

// isNIKRegistered memeriksa apakah NIK sudah terdaftar
// Menggunakan pendekatan legacy: dekripsi semua NIK dan bandingkan
func (u *authUsecase) isNIKRegistered(ctx context.Context, nik string, encryptionKey string) (bool, error) {
	users, err := u.userRepo.FindAll(ctx)
	if err != nil {
		return false, err
	}

	for _, user := range users {
		decryptedNIK, decErr := utils.DecryptNIK(user.NIKEncrypted, encryptionKey)
		if decErr != nil {
			utils.Warn("Failed to decrypt NIK for user",
				zap.String("user_id", user.ID.String()),
				zap.Error(decErr),
			)
			continue
		}
		if decryptedNIK == nik {
			return true, nil
		}
	}

	return false, nil
}

// findUserByNIK mencari user berdasarkan NIK dengan mendekripsi semua NIK
func (u *authUsecase) findUserByNIK(ctx context.Context, nik string, encryptionKey string) (*entity.User, error) {
	users, err := u.userRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	utils.Debug("Searching user by NIK",
		zap.Int("total_users", len(users)),
	)

	for i := range users {
		decryptedNIK, decErr := utils.DecryptNIK(users[i].NIKEncrypted, encryptionKey)
		if decErr != nil {
			utils.Warn("Failed to decrypt NIK for user",
				zap.String("user_id", users[i].ID.String()),
				zap.Error(decErr),
			)
			continue
		}
		if decryptedNIK == nik {
			utils.Debug("Found matching user by NIK",
				zap.String("user_id", users[i].ID.String()),
			)
			return &users[i], nil
		}
	}

	return nil, nil
}
