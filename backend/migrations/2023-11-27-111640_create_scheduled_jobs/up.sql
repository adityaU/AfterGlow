-- Your SQL goes here
ALTER TABLE bg_queue 
  ADD COLUMN name VARCHAR(255);

CREATE UNIQUE INDEX job_name_unique ON bg_queue (name)
WHERE name IS NOT NULL;
