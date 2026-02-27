package repository

import (
	"context"
	"time"

	"jantungin-api-server/internal/data/entity"

	"gorm.io/gorm"
)

type DailyVisit struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type StatsRepository interface {
	InsertRequestLog(ctx context.Context, log *entity.RequestLog) error
	CountTotalVisits(ctx context.Context) (int64, error)
	CountTodayVisits(ctx context.Context) (int64, error)
	CountMonthlyVisits(ctx context.Context) (int64, error)
	CountTotalUsers(ctx context.Context) (int64, error)
	CountTotalDiagnoses(ctx context.Context) (int64, error)
	GetDailyVisits(ctx context.Context, days int) ([]DailyVisit, error)
}

type statsRepository struct {
	db *gorm.DB
}

func NewStatsRepository(db *gorm.DB) StatsRepository {
	return &statsRepository{db: db}
}

func (r *statsRepository) InsertRequestLog(ctx context.Context, log *entity.RequestLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *statsRepository) CountTotalVisits(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&entity.RequestLog{}).Count(&count).Error
	return count, err
}

func (r *statsRepository) CountTodayVisits(ctx context.Context) (int64, error) {
	var count int64
	today := time.Now().Truncate(24 * time.Hour)
	err := r.db.WithContext(ctx).
		Model(&entity.RequestLog{}).
		Where("created_at >= ?", today).
		Count(&count).Error
	return count, err
}

func (r *statsRepository) CountMonthlyVisits(ctx context.Context) (int64, error) {
	var count int64
	now := time.Now()
	firstDayOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	err := r.db.WithContext(ctx).
		Model(&entity.RequestLog{}).
		Where("created_at >= ?", firstDayOfMonth).
		Count(&count).Error
	return count, err
}

func (r *statsRepository) CountTotalUsers(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Table("users").Count(&count).Error
	return count, err
}

func (r *statsRepository) CountTotalDiagnoses(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Table("diagnoses").Count(&count).Error
	return count, err
}

func (r *statsRepository) GetDailyVisits(ctx context.Context, days int) ([]DailyVisit, error) {
	var results []DailyVisit

	since := time.Now().AddDate(0, 0, -days).Truncate(24 * time.Hour)

	err := r.db.WithContext(ctx).
		Model(&entity.RequestLog{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("created_at >= ?", since).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return results, nil
}
