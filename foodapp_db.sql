DROP DATABASE IF EXISTS foodapp_db;
CREATE DATABASE foodapp_db;
USE foodapp_db;

CREATE TABLE food (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO food (name) VALUES ("Big Mac");





