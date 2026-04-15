package middleware

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/internal/data/repository"
)

func RequestTracker(statsRepo repository.StatsRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		latencyMs := time.Since(start).Milliseconds()

		// Ambil userID dari context kalau sudah login
		var userID *uuid.UUID
		if rawID, exists := c.Get(AuthUserIDKey); exists {
			if idStr, ok := rawID.(string); ok {
				if parsed, err := uuid.Parse(idStr); err == nil {
					userID = &parsed
				}
			}
		}

		log := &entity.RequestLog{
			Method:     c.Request.Method,
			Path:       c.Request.URL.Path,
			StatusCode: c.Writer.Status(),
			IP:         c.ClientIP(),
			UserAgent:  c.Request.UserAgent(),
			LatencyMs:  latencyMs,
			UserID:     userID,
		}

		// Semua nilai sudah di-capture sebelum goroutine
		// Pakai context.Background() karena c.Request.Context() sudah cancelled
		// saat request selesai dan goroutine baru mulai jalan
		go func(l *entity.RequestLog) {
			_ = statsRepo.InsertRequestLog(context.Background(), l)
		}(log)
	}
}
