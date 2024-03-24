-- Migration number: 0000 	 2024-03-24T18:17:59.820Z
CREATE TABLE IF NOT EXISTS streams (
    id INTEGER PRIMARY KEY,
    provider_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    avatar_url TEXT DEFAULT NULL,
    UNIQUE(provider, provider_id)
);
CREATE INDEX idx_streams_provider ON streams (provider);