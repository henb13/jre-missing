CREATE DATABASE jre_missing;

DROP TABLE IF EXISTS all_eps, test_table, date_removed, date_re_added, all_eps_log;


CREATE TABLE all_eps(
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  episode_number INTEGER,
  full_name VARCHAR(255) NOT NULL, 
  on_spotify BOOLEAN NOT NULL
  length INTEGER NOT NULL;
);

CREATE TABLE test_table(
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  episode_number INTEGER,
  full_name VARCHAR(255) NOT NULL, 
  on_spotify BOOLEAN NOT NULL
  length INTEGER NOT NULL;
);

CREATE TABLE date_removed(
  id INTEGER NOT NULL,
  date_removed timestamptz(0) NOT NULL,
  PRIMARY KEY (id, date_removed),
  CONSTRAINT fk_id
    FOREIGN KEY(id) 
	  REFERENCES all_eps(id)
);

CREATE TABLE date_re_added(
  id INTEGER NOT NULL,
  re_added timestamptz(0) NOT NULL,
  PRIMARY KEY (id, re_added),
  CONSTRAINT fk_id
    FOREIGN KEY(id)
	  REFERENCES all_eps(id)
);

CREATE TABLE length_changes(
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  episode_id INTEGER NOT NULL,
  date timestamptz(0) NOT NULL,
  old_length INTEGER,
  new_length INTEGER,
  CONSTRAINT fk_id
    FOREIGN KEY(episode_id) 
	  REFERENCES all_eps(id)
);

CREATE TABLE all_eps_log(
  last_checked timestamptz(0),
  last_modified timestamptz(0)
);

CREATE OR REPLACE FUNCTION last_modified() 
RETURNS TRIGGER AS $lm$ 
BEGIN 
  UPDATE all_eps_log SET last_modified=now();
  RETURN NEW;
END; 
$lm$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION spotify_status() 
RETURNS TRIGGER AS $ss$ 
BEGIN 
  IF (new.on_spotify = true) THEN
    INSERT INTO date_re_added VALUES(NEW.id, now());
    RETURN NEW; 
    ELSEIF (new.on_spotify = false) THEN
  INSERT INTO date_removed VALUES(NEW.id, now());
    RETURN NEW; 
    END IF;
  RETURN NULL; 
END; 
$ss$ LANGUAGE plpgsql;

CREATE TRIGGER spotify_status 
AFTER UPDATE ON all_eps
FOR EACH ROW
WHEN (OLD.on_spotify IS DISTINCT FROM NEW.on_spotify)
EXECUTE PROCEDURE spotify_status();

CREATE TRIGGER last_modified
AFTER UPDATE OR INSERT OR DELETE ON all_eps
FOR EACH ROW
EXECUTE PROCEDURE last_modified();