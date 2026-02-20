package dto

type AuthRegisterRequest struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email"`
	NIK         string `json:"nik" binding:"required"`
	Password    string `json:"password" binding:"required"`
	DateOfBirth string `json:"dateOfBirth"`
}

type AuthLoginRequest struct {
	NIK      string `json:"nik" binding:"required"`
	Password string `json:"password" binding:"required"`
}
