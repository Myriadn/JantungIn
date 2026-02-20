package entity

// TableName overrides the default GORM table name for User
func (User) TableName() string {
	return "users"
}

// TableName overrides the default GORM table name for Diagnosis
func (Diagnosis) TableName() string {
	return "diagnoses"
}
