package entity

import (
	"time"

	"github.com/google/uuid"
)

type Diagnosis struct {
	ID                    uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID                uuid.UUID  `gorm:"type:uuid;not null" json:"userId"`
	CreatedBy             *uuid.UUID `gorm:"type:uuid" json:"createdBy"` // Bisa null
	Age                   int        `gorm:"not null" json:"age"`
	Sex                   string     `gorm:"not null" json:"sex"`
	ChestPainType         string     `gorm:"not null" json:"chestPainType"`
	RestingEcgResults     string     `gorm:"not null" json:"restingEcgResults"`
	FastingBloodSugar     float64    `gorm:"not null" json:"fastingBloodSugar"`
	RestingBloodPressure  float64    `gorm:"not null" json:"restingBloodPressure"`
	MaximumHeartRate      int        `gorm:"not null" json:"maximumHeartRate"`
	ExerciseInducedAngina string     `gorm:"not null" json:"exerciseInducedAngina"`
	StSegment             string     `gorm:"not null" json:"stSegment"`
	MajorVessels          int        `gorm:"not null" json:"majorVessels"`
	Thalassemia           string     `gorm:"not null" json:"thalassemia"`
	SerumCholesterol      float64    `gorm:"not null" json:"serumCholesterol"`
	StDepression          float64    `gorm:"not null" json:"stDepression"`
	ResultPercentage      float64    `gorm:"not null" json:"resultPercentage"`
	CardiovascularRisk    string     `gorm:"not null" json:"cardiovascularRisk"`
	Prediction            string     `gorm:"default:'Berisiko';not null" json:"prediction"`
	CreatedAt             time.Time  `json:"createdAt"`
	UpdatedAt             time.Time  `json:"updatedAt"`

	// Relasi
	Patient User `gorm:"foreignKey:UserID" json:"patient,omitempty"`
	Creator User `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
}
