package repository

import (
	"context"
	"errors"
	"jantungin-api-server/internal/data/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DiagnosisRepository interface {
	Create(ctx context.Context, diagnosis *entity.Diagnosis) error
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Diagnosis, error)
	FindAll(ctx context.Context) ([]entity.Diagnosis, error)
	FindByPatientID(ctx context.Context, patientID uuid.UUID) ([]entity.Diagnosis, error)
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

func (r *diagnosisRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Diagnosis, error) {
	var diagnosis entity.Diagnosis
	err := r.db.WithContext(ctx).
		Preload("Patient", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Preload("Creator", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Where("id = ?", id).
		First(&diagnosis).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &diagnosis, nil
}

func (r *diagnosisRepository) FindAll(ctx context.Context) ([]entity.Diagnosis, error) {
	var diagnoses []entity.Diagnosis
	err := r.db.WithContext(ctx).
		Preload("Patient", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Preload("Creator", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Order("created_at DESC").
		Find(&diagnoses).Error
	if err != nil {
		return nil, err
	}
	return diagnoses, nil
}

func (r *diagnosisRepository) FindByPatientID(ctx context.Context, patientID uuid.UUID) ([]entity.Diagnosis, error) {
	var diagnoses []entity.Diagnosis
	err := r.db.WithContext(ctx).
		Preload("Patient", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Preload("Creator", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, role")
		}).
		Where("user_id = ?", patientID).
		Order("created_at DESC").
		Find(&diagnoses).Error
	if err != nil {
		return nil, err
	}
	return diagnoses, nil
}
