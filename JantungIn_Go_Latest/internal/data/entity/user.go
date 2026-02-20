package entity

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name         string     `gorm:"not null" json:"name"`
	Email        *string    `gorm:"unique" json:"email"` // Pointer karena opsional
	NIKEncrypted string     `gorm:"column:nik_encrypted;not null;unique" json:"-"`
	Password     string     `gorm:"not null" json:"-"`
	DateOfBirth  *time.Time `gorm:"type:date" json:"dateOfBirth"`
	Role         string     `gorm:"type:user_role;default:'user'" json:"role"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`

	// Relasi
	PatientDiagnoses []Diagnosis `gorm:"foreignKey:UserID" json:"patientDiagnoses,omitempty"`
	CreatedDiagnoses []Diagnosis `gorm:"foreignKey:CreatedBy" json:"createdDiagnoses,omitempty"`
}
