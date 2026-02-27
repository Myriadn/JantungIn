package entity

import (
	"time"

	"github.com/google/uuid"
)

type RequestLog struct {
	ID         int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	Method     string     `gorm:"not null" json:"method"`
	Path       string     `gorm:"not null" json:"path"`
	StatusCode int        `gorm:"not null" json:"statusCode"`
	IP         string     `gorm:"not null" json:"ip"`
	UserAgent  string     `json:"userAgent"`
	LatencyMs  int64      `gorm:"not null;default:0" json:"latencyMs"`
	UserID     *uuid.UUID `gorm:"type:uuid" json:"userId"`
	CreatedAt  time.Time  `json:"createdAt"`
}

func (RequestLog) TableName() string {
	return "request_logs"
}
