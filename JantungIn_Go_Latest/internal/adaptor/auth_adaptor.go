package adaptor

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jantungin-api-server/internal/dto"
	"jantungin-api-server/internal/usecase"
)

type AuthAdaptor struct {
	authUsecase usecase.AuthUsecase
}

func NewAuthAdaptor(authUsecase usecase.AuthUsecase) *AuthAdaptor {
	return &AuthAdaptor{
		authUsecase: authUsecase,
	}
}

func (h *AuthAdaptor) Register(c *gin.Context) {
	var req dto.AuthRegisterRequest

	// Bind JSON dari FE ke bentuk Struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
		return
	}

	// Lempar ke layer Usecase
	err := h.authUsecase.Register(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registrasi berhasil"})
}

func (h *AuthAdaptor) Login(c *gin.Context) {
	var req dto.AuthLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
		return
	}

	token, err := h.authUsecase.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"token":   token,
	})
}
