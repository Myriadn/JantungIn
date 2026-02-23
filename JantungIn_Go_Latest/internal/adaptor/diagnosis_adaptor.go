package adaptor

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jantungin-api-server/internal/dto"
	"jantungin-api-server/internal/usecase"
	"jantungin-api-server/pkg/middleware"
	"jantungin-api-server/pkg/utils"
)

type DiagnosisAdaptor struct {
	diagnosisUsecase usecase.DiagnosisUsecase
}

func NewDiagnosisAdaptor(diagnosisUsecase usecase.DiagnosisUsecase) *DiagnosisAdaptor {
	return &DiagnosisAdaptor{diagnosisUsecase: diagnosisUsecase}
}

// CreateDiagnosis - hanya admin/dokter (enforced di route level)
func (h *DiagnosisAdaptor) CreateDiagnosis(c *gin.Context) {
	creatorID := c.GetString(middleware.AuthUserIDKey)

	var req dto.CreateDiagnosisRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Format data tidak valid", err.Error())
		return
	}

	result, err := h.diagnosisUsecase.CreateDiagnosis(c.Request.Context(), creatorID, req)
	if err != nil {
		switch err.Error() {
		case "pasien tidak ditemukan":
			utils.NotFoundResponse(c, err.Error())
		case "invalid patient ID", "invalid creator ID":
			utils.BadRequestResponse(c, err.Error(), nil)
		case "gagal melakukan prediksi":
			utils.ErrorResponse(c, http.StatusServiceUnavailable, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Diagnosis created successfully", result)
}

// GetDiagnosisHistory - semua user terauth
// Pasien: history sendiri
// Admin/dokter: bisa tambah ?patientId= untuk lihat history pasien lain
func (h *DiagnosisAdaptor) GetDiagnosisHistory(c *gin.Context) {
	userID := c.GetString(middleware.AuthUserIDKey)
	role := c.GetString(middleware.AuthRoleCodeKey)
	patientID := c.Query("patientId") // query param, bukan path param

	diagnoses, err := h.diagnosisUsecase.GetDiagnosisHistory(c.Request.Context(), userID, role, patientID)
	if err != nil {
		switch err.Error() {
		case "invalid user ID":
			utils.BadRequestResponse(c, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Diagnoses retrieved successfully", diagnoses)
}

// GetDiagnosisByID - semua user terauth
// Pasien hanya bisa akses diagnosis miliknya sendiri
func (h *DiagnosisAdaptor) GetDiagnosisByID(c *gin.Context) {
	userID := c.GetString(middleware.AuthUserIDKey)
	role := c.GetString(middleware.AuthRoleCodeKey)
	diagnosisID := c.Param("id")

	diagnosis, err := h.diagnosisUsecase.GetDiagnosisByID(c.Request.Context(), userID, role, diagnosisID)
	if err != nil {
		switch err.Error() {
		case "diagnosis not found":
			utils.NotFoundResponse(c, err.Error())
		case "invalid diagnosis ID":
			utils.BadRequestResponse(c, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Diagnosis retrieved successfully", diagnosis)
}

// GetAllDiagnoses - hanya admin/dokter (enforced di route level)
func (h *DiagnosisAdaptor) GetAllDiagnoses(c *gin.Context) {
	diagnoses, err := h.diagnosisUsecase.GetAllDiagnoses(c.Request.Context())
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "All diagnoses retrieved successfully", diagnoses)
}

func (h *DiagnosisAdaptor) GetPatientDiagnoses(c *gin.Context) {
	patientID := c.Param("patientId")

	diagnoses, err := h.diagnosisUsecase.GetPatientDiagnoses(c.Request.Context(), patientID)
	if err != nil {
		switch err.Error() {
		case "pasien tidak ditemukan":
			utils.NotFoundResponse(c, err.Error())
		case "invalid patient ID":
			utils.BadRequestResponse(c, err.Error(), nil)
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Patient diagnoses retrieved successfully", diagnoses)
}
