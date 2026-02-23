package wire

import (
	"jantungin-api-server/internal/adaptor"
	"jantungin-api-server/internal/data/repository"
	"jantungin-api-server/internal/usecase"
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

	// Initialize repositories
	repo := repository.NewRepository(db)

	// Initialize usecases
	usecases := usecase.NewUseCase(repo.UserRepo, repo.DiagnosisRepo, cfg, db)

	// Initialize adaptors
	adaptors := adaptor.NewAdaptor(usecases)

	// Register routes
	api := router.Group("/api/v1")
	registerAuthRoutes(api, adaptors, cfg)
	registerDiagnosisRoutes(api, adaptors, cfg)

	utils.Info("Route wiring completed")

	return router
}

func registerAuthRoutes(api *gin.RouterGroup, adaptors *adaptor.Adaptor, cfg *utils.Config) {
	// Auth routes (public)
	auth := api.Group("/auth")
	{
		auth.POST("/register", adaptors.AuthAdaptor.Register)
		auth.POST("/login", adaptors.AuthAdaptor.Login)
		auth.POST("/login-email", adaptors.AuthAdaptor.LoginWithEmail)
	}

	// Auth routes (protected)
	authProtected := api.Group("/auth")
	authProtected.Use(middleware.AuthRequired(cfg))
	{
		authProtected.GET("/profile", adaptors.AuthAdaptor.GetProfile)
		authProtected.PUT("/profile", adaptors.AuthAdaptor.UpdateProfile)
	}
}

func registerDiagnosisRoutes(api *gin.RouterGroup, adaptors *adaptor.Adaptor, cfg *utils.Config) {
	diagnosis := api.Group("/diagnosis")
	diagnosis.Use(middleware.AuthRequired(cfg))
	{
		diagnosis.GET("/history", adaptors.DiagnosisAdaptor.GetDiagnosisHistory)
		diagnosis.GET("/:id", adaptors.DiagnosisAdaptor.GetDiagnosisByID)
	}

	diagnosisAdmin := api.Group("/diagnosis")
	diagnosisAdmin.Use(middleware.AuthRequired(cfg))
	diagnosisAdmin.Use(middleware.RoleRequired("admin", "dokter"))
	{
		diagnosisAdmin.POST("", adaptors.DiagnosisAdaptor.CreateDiagnosis)
	}

	admin := api.Group("/admin/diagnosis")
	admin.Use(middleware.AuthRequired(cfg))
	admin.Use(middleware.RoleRequired("admin", "dokter"))
	{
		admin.GET("/all", adaptors.DiagnosisAdaptor.GetAllDiagnoses)
		admin.GET("/patient/:patientId", adaptors.DiagnosisAdaptor.GetPatientDiagnoses)
	}
}
