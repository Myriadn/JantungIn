package adaptor

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jantungin-api-server/internal/dto"
	"jantungin-api-server/internal/usecase"
	"jantungin-api-server/pkg/middleware"
	"jantungin-api-server/pkg/utils"
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

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Format data tidak valid", err.Error())
		return
	}

	data, err := h.authUsecase.Register(c.Request.Context(), req)
	if err != nil {
		switch err.Error() {
		case "NIK harus 16 digit angka",
			"password minimal 6 karakter",
			"format tanggal lahir tidak valid, gunakan YYYY-MM-DD":
			utils.BadRequestResponse(c, err.Error(), nil)
		case "NIK sudah terdaftar. Setiap NIK hanya dapat digunakan sekali.",
			"email sudah terdaftar":
			utils.ErrorResponse(c, http.StatusConflict, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", data)
}

func (h *AuthAdaptor) Login(c *gin.Context) {
	var req dto.AuthLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Format data tidak valid", err.Error())
		return
	}

	data, err := h.authUsecase.Login(c.Request.Context(), req)
	if err != nil {
		switch err.Error() {
		case "NIK harus 16 digit angka":
			utils.BadRequestResponse(c, err.Error(), nil)
		case "NIK atau password tidak valid":
			utils.UnauthorizedResponse(c, err.Error())
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login berhasil", data)
}

func (h *AuthAdaptor) LoginWithEmail(c *gin.Context) {
	var req dto.AuthLoginEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Format data tidak valid", err.Error())
		return
	}

	data, err := h.authUsecase.LoginWithEmail(c.Request.Context(), req)
	if err != nil {
		switch err.Error() {
		case "email atau password tidak valid":
			utils.UnauthorizedResponse(c, err.Error())
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login berhasil", data)
}

func (h *AuthAdaptor) GetProfile(c *gin.Context) {
	userID, exists := c.Get(middleware.AuthUserIDKey)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		utils.UnauthorizedResponse(c, "Invalid user identity")
		return
	}

	data, err := h.authUsecase.GetProfile(c.Request.Context(), userIDStr)
	if err != nil {
		switch err.Error() {
		case "user not found":
			utils.NotFoundResponse(c, err.Error())
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Profile retrieved successfully", data)
}

func (h *AuthAdaptor) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get(middleware.AuthUserIDKey)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		utils.UnauthorizedResponse(c, "Invalid user identity")
		return
	}

	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Format data tidak valid", err.Error())
		return
	}

	data, err := h.authUsecase.UpdateProfile(c.Request.Context(), userIDStr, req)
	if err != nil {
		switch err.Error() {
		case "user not found":
			utils.NotFoundResponse(c, err.Error())
		case "format tanggal lahir tidak valid, gunakan YYYY-MM-DD":
			utils.BadRequestResponse(c, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Profile updated successfully", data)
}
