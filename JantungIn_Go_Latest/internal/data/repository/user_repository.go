package repository

import (
	"context"
	"errors"
	"jantungin-api-server/internal/data/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	FindByNIK(ctx context.Context, encryptedNIK string) (*entity.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error)
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	FindAll(ctx context.Context) ([]entity.User, error)
	FindAllByRole(ctx context.Context, role string) ([]entity.User, error)
	SearchByName(ctx context.Context, query string) ([]entity.User, error)
	Update(ctx context.Context, user *entity.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		db: db,
	}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) FindByNIK(ctx context.Context, encryptedNIK string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("nik_encrypted = ?", encryptedNIK).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindAll(ctx context.Context) ([]entity.User, error) {
	var users []entity.User
	err := r.db.WithContext(ctx).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

// FindAllByRole mengambil semua user berdasarkan role tertentu, diurutkan berdasarkan nama.
func (r *userRepository) FindAllByRole(ctx context.Context, role string) ([]entity.User, error) {
	var users []entity.User
	err := r.db.WithContext(ctx).
		Where("role = ?", role).
		Order("name ASC").
		Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

// SearchByName mencari user dengan role 'user' berdasarkan nama (case-insensitive ILIKE).
// Digunakan untuk fitur pencarian pasien di halaman diagnosa admin/dokter.
func (r *userRepository) SearchByName(ctx context.Context, query string) ([]entity.User, error) {
	var users []entity.User
	err := r.db.WithContext(ctx).
		Where("role = 'user' AND name ILIKE ?", "%"+query+"%").
		Order("name ASC").
		Limit(20).
		Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userRepository) Update(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}
