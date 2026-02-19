package cmd

import (
	"context"
	"fmt"
	"jantungin-api-server/pkg/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Server struct {
	engine *gin.Engine
	config *utils.Config
}

func NewServer(engine *gin.Engine, cfg *utils.Config) *Server {
	return &Server{
		engine: engine,
		config: cfg,
	}
}

func (s *Server) Run() error {
	addr := fmt.Sprintf(":%s", s.config.App.Port)

	srv := &http.Server{
		Addr:    addr,
		Handler: s.engine,
	}

	utils.Info("Starting HTTP server",
		zap.String("address", addr),
		zap.String("env", s.config.App.Env),
	)

	return srv.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	utils.Info("Shutting down HTTP server gracefully")

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", s.config.App.Port),
		Handler: s.engine,
	}

	shutdownCtx, cancel := context.WithTimeout(ctx, s.config.App.ShutdownTimeout)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		utils.Error("Server forced to shutdown", zap.Error(err))
		return err
	}

	utils.Info("HTTP server stopped gracefully")
	return nil
}
