package entity

import (
	"time"

	"github.com/google/uuid"
)

type UserDevice struct {
	ID                uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID            uuid.UUID `gorm:"type:uuid;not null;index:idx_user_devices_user_id" json:"userId"`
	UserAgent         string    `gorm:"type:text;not null" json:"userAgent"`
	IPAddress         string    `gorm:"type:varchar(45);not null" json:"ipAddress"`
	DeviceFingerprint string    `gorm:"type:varchar(255);not null" json:"deviceFingerprint"`
	LastLogin         time.Time `gorm:"type:timestamp with time zone;default:CURRENT_TIMESTAMP" json:"lastLogin"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`

	// Relasi ke User
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName menentukan nama tabel di database
func (UserDevice) TableName() string {
	return "user_devices"
}
