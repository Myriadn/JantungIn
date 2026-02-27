package dto

import (
	"jantungin-api-server/internal/data/entity"
)

func ToDiagnosisResponse(d entity.Diagnosis) DiagnosisResponse {
	var createdByStr *string
	if d.CreatedBy != nil {
		s := d.CreatedBy.String()
		createdByStr = &s
	}

	resp := DiagnosisResponse{
		ID:                    d.ID.String(),
		UserID:                d.UserID.String(),
		CreatedBy:             createdByStr,
		Age:                   d.Age,
		Sex:                   d.Sex,
		ChestPainType:         d.ChestPainType,
		RestingEcgResults:     d.RestingEcgResults,
		FastingBloodSugar:     d.FastingBloodSugar,
		RestingBloodPressure:  d.RestingBloodPressure,
		MaximumHeartRate:      d.MaximumHeartRate,
		ExerciseInducedAngina: d.ExerciseInducedAngina,
		StSegment:             d.StSegment,
		MajorVessels:          d.MajorVessels,
		Thalassemia:           d.Thalassemia,
		SerumCholesterol:      d.SerumCholesterol,
		StDepression:          d.StDepression,
		ResultPercentage:      d.ResultPercentage,
		CardiovascularRisk:    d.CardiovascularRisk,
		Prediction:            d.Prediction,
		Patient: DiagnosisUserInfo{
			Name: d.Patient.Name,
			Role: d.Patient.Role,
		},
		CreatedAt: d.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: d.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	// Creator hanya di-set jika ada
	if d.CreatedBy != nil {
		resp.Creator = &DiagnosisUserInfo{
			Name: d.Creator.Name,
			Role: d.Creator.Role,
		}
	}

	return resp
}

func ToDiagnosisResponseList(diagnoses []entity.Diagnosis) []DiagnosisResponse {
	result := make([]DiagnosisResponse, len(diagnoses))
	for i, d := range diagnoses {
		result[i] = ToDiagnosisResponse(d)
	}
	return result
}
