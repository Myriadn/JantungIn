-- Aktifkan pgcrypto extension untuk bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed admin user
-- Default credentials:
--   Email    : admin@jantungin.com
--   Password : Admin@JantungIn2024
--
-- CATATAN: nik_encrypted diisi random placeholder karena enkripsi NIK
-- dilakukan di application layer (AES-256-GCM). Admin menggunakan
-- email login, bukan NIK login. Untuk set NIK yang valid, gunakan
-- endpoint PUT /api/v1/auth/profile setelah login pertama kali.

INSERT INTO users (
    id,
    name,
    email,
    nik_encrypted,
    password,
    role,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Administrator',
    'admin@jantungin.com',
    encode(gen_random_bytes(32), 'hex'),
    crypt('Admin@JantungIn2024', gen_salt('bf', 10)),
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
