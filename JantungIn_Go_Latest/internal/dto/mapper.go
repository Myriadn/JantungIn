package dto

import (
	"jantungin-api-server/internal/data/entity"
)

func ToPatientResponse(u entity.User) PatientResponse {
	var dob *string
	if u.DateOfBirth != nil {
		s := u.DateOfBirth.Format("2006-01-02")
		dob = &s
	}
	return PatientResponse{
		ID:          u.ID.String(),
		Name:        u.Name,
		Email:       u.Email,
		DateOfBirth: dob,
		Role:        u.Role,
		CreatedAt:   u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func ToPatientResponseList(users []entity.User) []PatientResponse {
	result := make([]PatientResponse, len(users))
	for i, u := range users {
		result[i] = ToPatientResponse(u)
	}
	return result
}

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
