package database

import (
	"context"
	"fmt"
	"jantungin-api-server/pkg/utils"
)

type Manager struct {
	Postgres *PostgresDB
	// Redis    *RedisClient
}

func NewManager(cfg *utils.Config) (*Manager, error) {
	postgres, err := NewPostgresConnection(&cfg.Database)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize PostgreSQL: %w", err)
	}

	// redis, err := NewRedisConnection(&cfg.Redis)
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to initialize Redis: %w", err)
	// }

	return &Manager{
		Postgres: postgres,
		// Redis:    redis,
	}, nil
}

func (m *Manager) Close() error {
	if err := m.Postgres.Close(); err != nil {
		return fmt.Errorf("failed to close PostgreSQL: %w", err)
	}
	// if err := m.Redis.Close(); err != nil {
	// 	return fmt.Errorf("failed to close Redis: %w", err)
	// }
	return nil
}

func (m *Manager) HealthCheck(ctx context.Context) error {
	if err := m.Postgres.HealthCheck(); err != nil {
		return fmt.Errorf("PostgreSQL health check failed: %w", err)
	}
	// if err := m.Redis.HealthCheck(ctx); err != nil {
	// 	return fmt.Errorf("Redis health check failed: %w", err)
	// }
	return nil
}
