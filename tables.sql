DROP DATABASE IF EXISTS cs_data;

CREATE DATABASE cs_data
WITH
OWNER = postgres
ENCODING = 'UTF8'
LC_COLLATE = 'Turkish_Turkey.1254'
LC_CTYPE = 'Turkish_Turkey.1254'
TABLESPACE = pg_default

CREATE TABLE public.observation (
  ID SERIAL PRIMARY KEY,
  CODE VARCHAR,
  LOC_DESC VARCHAR,
  LOC_LAT REAL,
  LOC_LON REAL,
  PROPERTY VARCHAR,
  INSERTED_AT timestamp,
  RECORDED_AT timestamp,
  MEASUREMENT REAL,
  NOTE TEXT,
  IS_VALID boolean DEFAULT true,
  USER_CODE VARCHAR,
  USERNAME VARCHAR,
  CONSTRAINT name_unq UNIQUE (CODE)
);