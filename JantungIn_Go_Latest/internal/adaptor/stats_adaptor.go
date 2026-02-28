package adaptor

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jantungin-api-server/internal/usecase"
	"jantungin-api-server/pkg/utils"
)

type StatsAdaptor struct {
	statsUsecase usecase.StatsUsecase
}

func NewStatsAdaptor(statsUsecase usecase.StatsUsecase) *StatsAdaptor {
	return &StatsAdaptor{statsUsecase: statsUsecase}
}

// GetPublicStats - public endpoint, tidak butuh auth
// Dipakai untuk homepage: total users dan total diagnoses
func (h *StatsAdaptor) GetPublicStats(c *gin.Context) {
	stats, err := h.statsUsecase.GetPublicStats(c.Request.Context())
	if err != nil {
		utils.InternalServerErrorResponse(c, "Gagal mengambil statistik", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Stats retrieved successfully", stats)
}

// GetAdminStats - admin/dokter only endpoint
// Dipakai untuk dashboard admin: total kunjungan, grafik harian, dll
func (h *StatsAdaptor) GetAdminStats(c *gin.Context) {
	stats, err := h.statsUsecase.GetAdminStats(c.Request.Context())
	if err != nil {
		utils.InternalServerErrorResponse(c, "Gagal mengambil statistik admin", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Admin stats retrieved successfully", stats)
}
