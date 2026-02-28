-- Tabel untuk mencatat setiap request yang masuk ke API
CREATE TABLE request_logs (
    id          BIGSERIAL PRIMARY KEY,
    method      VARCHAR(10)  NOT NULL,
    path        TEXT         NOT NULL,
    status_code INT          NOT NULL,
    ip          VARCHAR(45)  NOT NULL,
    user_agent  TEXT,
    latency_ms  BIGINT       NOT NULL DEFAULT 0,
    user_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk query stats per tanggal (paling sering dipakai)
CREATE INDEX idx_request_logs_created_at ON request_logs (created_at);

-- Index untuk filter per path (misal hanya hitung kunjungan halaman tertentu)
CREATE INDEX idx_request_logs_path ON request_logs (path);

-- Index untuk filter per user
CREATE INDEX idx_request_logs_user_id ON request_logs (user_id);
