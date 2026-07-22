CREATE TABLE IF NOT EXISTS pin_shares (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL CHECK (length(payload) <= 1500000),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS pin_shares_expires_at_idx
  ON pin_shares (expires_at);
