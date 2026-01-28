DROP TABLE IF EXISTS screenshots;
DROP TABLE IF EXISTS entries;

DROP TYPE IF EXISTS status_type;
DROP EXTENSION IF EXISTS pgcrypto;

DROP DATABASE IF EXISTS hunter;

CREATE DATABASE hunter;

\c hunter

CREATE EXTENSION pgcrypto;

CREATE TYPE status_type AS ENUM ('Not started', 'Interview scheduled', 'Applied', 'Successful', 'Unsuccessful', 'Interviewed', 'Declined offer', 'Role offered', 'Complete assessment', 'Assessment completed');

CREATE TABLE entries (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   text NOT NULL,
  title   varchar(50) NOT NULL,
  description   varchar(350) NOT NULL,
  employer    varchar(50) NOT NULL,
  contact   varchar(50),
  status  status_type NOT NULL,
  submission_date   date NOT NULL,
  last_updated    timestamp DEFAULT CURRENT_TIMESTAMP,
  location    varchar(100),
  notes   varchar(350),
  found_where   varchar(100) NOT NULL
);

CREATE TABLE screenshots(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID references entries(id) NOT NULL,
  uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP,
  url text NOT NULL
);
