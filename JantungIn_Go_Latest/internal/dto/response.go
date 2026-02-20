package dto

type AuthUserResponse struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Email *string `json:"email"`
	Role  string  `json:"role"`
}

type AuthRegisterResponse struct {
	StatusCode int              `json:"statusCode"`
	Message    string           `json:"message"`
	Data       AuthRegisterData `json:"data"`
}

type AuthRegisterData struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Email *string `json:"email"`
	Role  string  `json:"role"`
	Token string  `json:"token"`
}

type AuthLoginResponse struct {
	StatusCode int           `json:"statusCode"`
	Message    string        `json:"message"`
	Data       AuthLoginData `json:"data"`
}

type AuthLoginData struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Email *string `json:"email"`
	Role  string  `json:"role"`
	Token string  `json:"token"`
}

type ProfileResponse struct {
	StatusCode int              `json:"statusCode"`
	Message    string           `json:"message"`
	Data       AuthUserResponse `json:"data"`
}

type UpdateProfileResponse struct {
	StatusCode int               `json:"statusCode"`
	Message    string            `json:"message"`
	Data       UpdateProfileData `json:"data"`
}

type UpdateProfileData struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Email       *string `json:"email"`
	DateOfBirth *string `json:"dateOfBirth,omitempty"`
}
