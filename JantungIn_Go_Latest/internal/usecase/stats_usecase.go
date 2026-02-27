package usecase

import (
	"context"

	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/pkg/utils"

	"go.uber.org/zap"
)

type PublicStats struct {
	TotalUsers     int64 `json:"totalUsers"`
	TotalDiagnoses int64 `json:"totalDiagnoses"`
}

type AdminStats struct {
	TotalVisits    int64                   `json:"totalVisits"`
	TodayVisits    int64                   `json:"todayVisits"`
	MonthlyVisits  int64                   `json:"monthlyVisits"`
	TotalUsers     int64                   `json:"totalUsers"`
	TotalDiagnoses int64                   `json:"totalDiagnoses"`
	DailyVisits    []repository.DailyVisit `json:"dailyVisits"`
}

type StatsUsecase interface {
	GetPublicStats(ctx context.Context) (*PublicStats, error)
	GetAdminStats(ctx context.Context) (*AdminStats, error)
}

type statsUsecase struct {
	statsRepo repository.StatsRepository
}

func NewStatsUsecase(statsRepo repository.StatsRepository) StatsUsecase {
	return &statsUsecase{
		statsRepo: statsRepo,
	}
}

func (u *statsUsecase) GetPublicStats(ctx context.Context) (*PublicStats, error) {
	totalUsers, err := u.statsRepo.CountTotalUsers(ctx)
	if err != nil {
		utils.Error("Failed to count total users", zap.Error(err))
		return nil, err
	}

	totalDiagnoses, err := u.statsRepo.CountTotalDiagnoses(ctx)
	if err != nil {
		utils.Error("Failed to count total diagnoses", zap.Error(err))
		return nil, err
	}

	return &PublicStats{
		TotalUsers:     totalUsers,
		TotalDiagnoses: totalDiagnoses,
	}, nil
}

func (u *statsUsecase) GetAdminStats(ctx context.Context) (*AdminStats, error) {
	totalVisits, err := u.statsRepo.CountTotalVisits(ctx)
	if err != nil {
		utils.Error("Failed to count total visits", zap.Error(err))
		return nil, err
	}

	todayVisits, err := u.statsRepo.CountTodayVisits(ctx)
	if err != nil {
		utils.Error("Failed to count today visits", zap.Error(err))
		return nil, err
	}

	monthlyVisits, err := u.statsRepo.CountMonthlyVisits(ctx)
	if err != nil {
		utils.Error("Failed to count monthly visits", zap.Error(err))
		return nil, err
	}

	totalUsers, err := u.statsRepo.CountTotalUsers(ctx)
	if err != nil {
		utils.Error("Failed to count total users", zap.Error(err))
		return nil, err
	}

	totalDiagnoses, err := u.statsRepo.CountTotalDiagnoses(ctx)
	if err != nil {
		utils.Error("Failed to count total diagnoses", zap.Error(err))
		return nil, err
	}

	// Ambil data kunjungan 7 hari terakhir untuk grafik
	dailyVisits, err := u.statsRepo.GetDailyVisits(ctx, 7)
	if err != nil {
		utils.Error("Failed to get daily visits", zap.Error(err))
		return nil, err
	}

	return &AdminStats{
		TotalVisits:    totalVisits,
		TodayVisits:    todayVisits,
		MonthlyVisits:  monthlyVisits,
		TotalUsers:     totalUsers,
		TotalDiagnoses: totalDiagnoses,
		DailyVisits:    dailyVisits,
	}, nil
}
