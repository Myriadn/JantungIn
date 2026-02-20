package repository

import (
	"context"
	"jantungin-api-server/internal/data/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DiagnosisRepository interface {
	Create(ctx context.Context, diagnosis *entity.Diagnosis) error
	FindByUserID(ctx context.Context, userID uuid.UUID) ([]entity.Diagnosis, error)
}

type diagnosisRepository struct {
	db *gorm.DB
}

func NewDiagnosisRepository(db *gorm.DB) DiagnosisRepository {
	return &diagnosisRepository{
		db: db,
	}
}

func (r *diagnosisRepository) Create(ctx context.Context, diagnosis *entity.Diagnosis) error {
	return r.db.WithContext(ctx).Create(diagnosis).Error
}

func (r *diagnosisRepository) FindByUserID(ctx context.Context, userID uuid.UUID) ([]entity.Diagnosis, error) {
	var diagnoses []entity.Diagnosis

	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&diagnoses).Error

	if err != nil {
		return nil, err
	}
	return diagnoses, nil
}
