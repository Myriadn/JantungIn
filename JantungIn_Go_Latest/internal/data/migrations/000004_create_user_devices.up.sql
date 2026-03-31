-- Create user_devices table with hybrid approach: plaintext data for documentation + hash for matching
CREATE TABLE user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_agent TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    device_fingerprint VARCHAR(255) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_device UNIQUE(user_id, device_fingerprint)
);

-- Index untuk query devices by user
CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);

-- Index untuk quick lookup specific device
CREATE INDEX idx_user_devices_user_fingerprint ON user_devices(user_id, device_fingerprint);
