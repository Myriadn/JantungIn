-- Membuat custom tipe ENUM untuk role
CREATE TYPE user_role AS ENUM ('user', 'admin', 'dokter');

-- Tabel Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    nik_encrypted TEXT NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Diagnoses
CREATE TABLE diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    age INT NOT NULL,
    sex VARCHAR(50) NOT NULL,
    chest_pain_type VARCHAR(255) NOT NULL,
    resting_ecg_results VARCHAR(255) NOT NULL,
    fasting_blood_sugar FLOAT NOT NULL,
    resting_blood_pressure FLOAT NOT NULL,
    maximum_heart_rate INT NOT NULL,
    exercise_induced_angina VARCHAR(255) NOT NULL,
    st_segment VARCHAR(255) NOT NULL,
    major_vessels INT NOT NULL,
    thalassemia VARCHAR(255) NOT NULL,
    serum_cholesterol FLOAT NOT NULL,
    st_depression FLOAT NOT NULL,
    result_percentage FLOAT NOT NULL,
    cardiovascular_risk VARCHAR(255) NOT NULL,
    prediction VARCHAR(255) DEFAULT 'Berisiko' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
