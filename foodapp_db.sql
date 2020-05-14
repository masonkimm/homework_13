DROP DATABASE IF EXISTS foodapp_db;
CREATE DATABASE foodapp_db;
USE foodapp_db;

CREATE TABLE food (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE finished_food(
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50) NOT NULL,
  finished BOOLEAN,
  PRIMARY KEY (id)
);

INSERT INTO food (name) VALUES ("Big Mac");
INSERT INTO finished_food (name) VALUES ("Big Mac_done");




