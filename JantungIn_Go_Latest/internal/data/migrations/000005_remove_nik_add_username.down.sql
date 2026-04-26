ALTER TABLE users
ADD COLUMN IF NOT EXISTS nik_encrypted TEXT;

UPDATE users
SET nik_encrypted = MD5(id::text || clock_timestamp()::text)
WHERE nik_encrypted IS NULL OR BTRIM(nik_encrypted) = '';

ALTER TABLE users
ALTER COLUMN nik_encrypted SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_nik_encrypted_key'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_nik_encrypted_key UNIQUE (nik_encrypted);
    END IF;
END $$;

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_username_key;

ALTER TABLE users
DROP COLUMN IF EXISTS username;
