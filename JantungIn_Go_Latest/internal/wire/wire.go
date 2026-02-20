package wire

import (
	"jantungin-api-server/pkg/middleware"
	"jantungin-api-server/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Wiring(cfg *utils.Config, db *gorm.DB) *gin.Engine {
	utils.Info("Starting route wiring process")

	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
		utils.Info("Gin mode set to release")
	} else {
		utils.Info("Gin mode set to debug")
	}

	router := gin.New()
	router.Use(middleware.Recovery())
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg))

	usecases := usecase.NewUseCase(repo, cfg, db)
	adaptors := adaptor.NewAdaptor(usecases)
	authRepo := repository.NewAuthRepository(repo)

	return router
}
