package repository

import (
	"context"
	"errors"

	"jantungin-api-server/internal/data/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UserDeviceRepository interface {
	CreateOrUpdate(ctx context.Context, userID uuid.UUID, userAgent, ipAddress, deviceFingerprint string) error
	FindByUserID(ctx context.Context, userID uuid.UUID) ([]entity.UserDevice, error)
	FindByUserIDAndFingerprint(ctx context.Context, userID uuid.UUID, fingerprint string) (*entity.UserDevice, error)
	DeleteByUserIDAndFingerprint(ctx context.Context, userID uuid.UUID, fingerprint string) error
}

type userDeviceRepository struct {
	db *gorm.DB
}

func NewUserDeviceRepository(db *gorm.DB) UserDeviceRepository {
	return &userDeviceRepository{db: db}
}

// CreateOrUpdate creates a new device record or updates last_login if device already exists.
// Stores plaintext user_agent and ip_address for documentation, and hash for matching.
// Uses UPSERT logic: on conflict of (user_id, device_fingerprint), update last_login and updated_at.
func (r *userDeviceRepository) CreateOrUpdate(ctx context.Context, userID uuid.UUID, userAgent, ipAddress, deviceFingerprint string) error {
	device := &entity.UserDevice{
		ID:                uuid.New(),
		UserID:            userID,
		UserAgent:         userAgent,
		IPAddress:         ipAddress,
		DeviceFingerprint: deviceFingerprint,
	}

	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "device_fingerprint"}},
		DoUpdates: clause.AssignmentColumns([]string{"last_login", "updated_at"}),
	}).Create(device).Error
}

// FindByUserID retrieves all devices associated with a specific user.
func (r *userDeviceRepository) FindByUserID(ctx context.Context, userID uuid.UUID) ([]entity.UserDevice, error) {
	var devices []entity.UserDevice
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("last_login DESC").
		Find(&devices).Error

	if err != nil {
		return nil, err
	}

	return devices, nil
}

// FindByUserIDAndFingerprint retrieves a specific device for a user.
func (r *userDeviceRepository) FindByUserIDAndFingerprint(ctx context.Context, userID uuid.UUID, fingerprint string) (*entity.UserDevice, error) {
	var device entity.UserDevice
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND device_fingerprint = ?", userID, fingerprint).
		First(&device).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &device, nil
}

// DeleteByUserIDAndFingerprint removes a specific device from a user's device list.
func (r *userDeviceRepository) DeleteByUserIDAndFingerprint(ctx context.Context, userID uuid.UUID, fingerprint string) error {
	return r.db.WithContext(ctx).
		Where("user_id = ? AND device_fingerprint = ?", userID, fingerprint).
		Delete(&entity.UserDevice{}).Error
}
