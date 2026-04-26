-- Add username column for existing databases that don't have it yet
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- Backfill username from email local-part when possible
UPDATE users
SET username = LOWER(SPLIT_PART(email, '@', 1))
WHERE (username IS NULL OR BTRIM(username) = '')
  AND email IS NOT NULL
  AND BTRIM(email) <> '';

-- Fallback username for rows without email/local-part
UPDATE users
SET username = 'user_' || SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 8)
WHERE username IS NULL OR BTRIM(username) = '';

-- Resolve duplicate usernames before enforcing unique constraint
WITH ranked AS (
    SELECT id,
           username,
           ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at, id) AS rn
    FROM users
)
UPDATE users u
SET username = ranked.username || '_' || SUBSTRING(REPLACE(u.id::text, '-', '') FROM 1 FOR 6)
FROM ranked
WHERE u.id = ranked.id
  AND ranked.rn > 1;

ALTER TABLE users
ALTER COLUMN username SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_username_key'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_username_key UNIQUE (username);
    END IF;
END $$;

-- Remove legacy NIK storage column if it still exists
ALTER TABLE users
DROP COLUMN IF EXISTS nik_encrypted;
