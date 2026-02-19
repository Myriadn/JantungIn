package middleware

import (
	"jantungin-api-server/pkg/utils"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				utils.Error("Panic recovered",
					zap.Any("error", err),
					zap.String("path", c.Request.URL.Path),
				)

				utils.InternalServerErrorResponse(c, "Internal server error", nil)
				c.Abort()
			}
		}()
		c.Next()
	}
}
