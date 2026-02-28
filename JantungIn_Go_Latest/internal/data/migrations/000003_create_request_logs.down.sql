-- Hapus index terlebih dahulu sebelum drop table
DROP INDEX IF EXISTS idx_request_logs_user_id;
DROP INDEX IF EXISTS idx_request_logs_path;
DROP INDEX IF EXISTS idx_request_logs_created_at;

-- Hapus tabel request_logs
DROP TABLE IF EXISTS request_logs;
