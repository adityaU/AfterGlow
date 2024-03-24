CREATE TABLE bg_queue (
  id UUID PRIMARY KEY,
  inserted_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,

  scheduled_for TIMESTAMP NOT NULL,
  failed_attempts INT NOT NULL,
  status INT NOT NULL,
  message JSONB NOT NULL
);
CREATE INDEX index_bg_queue_on_scheduled_for ON bg_queue (scheduled_for);
CREATE INDEX index_bg_queue_on_status ON bg_queue (status);