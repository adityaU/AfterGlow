-- Your SQL goes here
ALTER TABLE app_columns 
ADD COLUMN is_primary boolean NOT NULL DEFAULT false;
