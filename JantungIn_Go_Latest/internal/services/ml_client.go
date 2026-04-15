package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type MLPredictRequest struct {
	Age                   int     `json:"age"`
	Sex                   string  `json:"sex"`
	ChestPainType         string  `json:"chestPainType"`
	RestingBloodPressure  float64 `json:"restingBloodPressure"`
	SerumCholesterol      float64 `json:"serumCholesterol"`
	FastingBloodSugar     float64 `json:"fastingBloodSugar"`
	RestingEcgResults     string  `json:"restingEcgResults"`
	MaximumHeartRate      int     `json:"maximumHeartRate"`
	ExerciseInducedAngina string  `json:"exerciseInducedAngina"`
	StDepression          float64 `json:"stDepression"`
	StSegment             string  `json:"stSegment"`
	MajorVessels          int     `json:"majorVessels"`
	Thalassemia           string  `json:"thalassemia"`
}

type MLPredictResult struct {
	ResultPercentage   int    `json:"resultPercentage"`
	CardiovascularRisk string `json:"cardiovascularRisk"`
	Prediction         string `json:"prediction"`
}

type mlPredictResponse struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Data    MLPredictResult `json:"data"`
}

type MLClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewMLClient(baseURL string) *MLClient {
	return &MLClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *MLClient) Predict(ctx context.Context, req MLPredictRequest) (*MLPredictResult, error) {
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal predict request: %w", err)
	}

	url := fmt.Sprintf("%s/api/v1/predict", c.baseURL)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create http request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to call ML service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ML service returned status %d", resp.StatusCode)
	}

	var mlResp mlPredictResponse
	if err := json.NewDecoder(resp.Body).Decode(&mlResp); err != nil {
		return nil, fmt.Errorf("failed to decode ML response: %w", err)
	}

	if !mlResp.Success {
		return nil, fmt.Errorf("ML service error: %s", mlResp.Message)
	}

	return &mlResp.Data, nil
}
