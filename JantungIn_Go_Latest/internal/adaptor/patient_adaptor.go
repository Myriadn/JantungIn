package adaptor

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jantungin-api-server/internal/dto"
	"jantungin-api-server/internal/usecase"
	"jantungin-api-server/pkg/utils"
)

type PatientAdaptor struct {
	patientUsecase usecase.PatientUsecase
}

func NewPatientAdaptor(patientUsecase usecase.PatientUsecase) *PatientAdaptor {
	return &PatientAdaptor{patientUsecase: patientUsecase}
}

// GetAllPatients GET /api/v1/admin/patients
func (h *PatientAdaptor) GetAllPatients(c *gin.Context) {
	patients, err := h.patientUsecase.GetAllPatients(c.Request.Context())
	if err != nil {
		utils.InternalServerErrorResponse(c, "Gagal mengambil data pasien", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Patients retrieved successfully", dto.ToPatientResponseList(patients))
}

// GetPatientByID GET /api/v1/admin/patients/:id
func (h *PatientAdaptor) GetPatientByID(c *gin.Context) {
	id := c.Param("id")

	patient, err := h.patientUsecase.GetPatientByID(c.Request.Context(), id)
	if err != nil {
		switch err.Error() {
		case "invalid patient ID":
			utils.BadRequestResponse(c, err.Error(), nil)
		case "patient not found":
			utils.NotFoundResponse(c, err.Error())
		default:
			utils.InternalServerErrorResponse(c, err.Error(), nil)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Patient retrieved successfully", dto.ToPatientResponse(*patient))
}

// SearchPatients GET /api/v1/admin/patients/search?query=...
func (h *PatientAdaptor) SearchPatients(c *gin.Context) {
	query := c.Query("query")

	if query == "" {
		utils.BadRequestResponse(c, "query parameter diperlukan", nil)
		return
	}

	patients, err := h.patientUsecase.SearchPatients(c.Request.Context(), query)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Gagal mencari pasien", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Search results", dto.ToPatientResponseList(patients))
}
