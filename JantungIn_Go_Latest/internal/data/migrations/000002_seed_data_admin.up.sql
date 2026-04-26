-- Aktifkan pgcrypto extension untuk bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed admin user
-- Default credentials:
--   Username : admin
--   Password : Admin@JantungIn2024

INSERT INTO users (
    id,
    name,
    username,
    email,
    password,
    role,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Administrator',
    'admin',
    'admin@jantungin.com',
    crypt('Admin@JantungIn2024', gen_salt('bf', 10)),
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
