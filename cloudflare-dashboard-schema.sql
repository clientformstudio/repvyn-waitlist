CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  manage_token TEXT NOT NULL,
  interest TEXT,
  consent_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  interest_updated_at INTEGER,
  unsubscribed_at INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique ON waitlist(email);
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_manage_token_unique ON waitlist(manage_token);
