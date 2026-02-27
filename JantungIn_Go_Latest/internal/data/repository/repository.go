package repository

import "gorm.io/gorm"

type Repository struct {
	UserRepo      UserRepository
	DiagnosisRepo DiagnosisRepository
	StatsRepo     StatsRepository
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{
		UserRepo:      NewUserRepository(db),
		DiagnosisRepo: NewDiagnosisRepository(db),
		StatsRepo:     NewStatsRepository(db),
	}
}
