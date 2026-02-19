package wire

import (
	"jantungin-api-server/pkg/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Wiring() *gin.Engine {
	router := gin.New()

	utils.Info("Starting route wiring process")

	router.GET("/ping", func(c *gin.Context) {
		// Return JSON response
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return router
}
