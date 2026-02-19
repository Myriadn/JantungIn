package main

import (
	"context"
	"jantungin-api-server/cmd"
	"jantungin-api-server/internal/wire"
	"jantungin-api-server/pkg/database"
	"jantungin-api-server/pkg/utils"
	"os"
	"os/signal"
	"syscall"

	"go.uber.org/zap"
)

func main() {
	cfg, err := utils.LoadConfig()
	if err != nil {
		panic("Failed to load config: " + err.Error())
	}

	if err := utils.InitLogger(cfg.App.Env); err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}
	defer utils.Sync()

	utils.Info("Starting application",
		zap.String("name", cfg.App.Name),
		zap.String("env", cfg.App.Env),
		zap.String("port", cfg.App.Port),
	)

	dbManager, err := database.NewManager(cfg)
	if err != nil {
		utils.Fatal("Failed to initialize databases", zap.Error(err))
	}
	defer dbManager.Close()

	ctx := context.Background()
	router := wire.Wiring(cfg, dbManager.Postgres.GetDB())

	// Create and run server
	server := cmd.NewServer(router, cfg)

	go func() {
		if err := server.Run(); err != nil {
			utils.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	utils.Info("Shutting down application")
	server.Shutdown(ctx)
	utils.Info("Application stopped gracefully")
}
