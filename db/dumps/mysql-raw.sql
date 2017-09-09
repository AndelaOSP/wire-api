
CREATE TABLE user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  access_level INT DEFAULT 0
);

CREATE TABLE location(
  id int primary key AUTO_INCREMENT,
  name VARCHAR(50)
);

CREATE TABLE incident_level(
  id int primary key AUTO_INCREMENT,
  name VARCHAR(50)
);

CREATE TABLE incident_category(
  id int primary key AUTO_INCREMENT,
  name varchar(250),
  level_id int,
  visible boolean,
  foreign key (level_id) references incident_level(id)
);

CREATE TABLE incident(
  id int primary key AUTO_INCREMENT,
  user_id int,
  category_id int,
  location_id int,
  description text,
  date_occurred timestamp,
  date_created timestamp DEFAULT CURRENT_TIMESTAMP,
  foreign key (user_id) references user(id),
  foreign key (category_id) references incident_category(id),
  foreign key (location_id) references location(id)
);

CREATE TABLE note(
  id int primary key AUTO_INCREMENT,
  note text,
  incident_id int,
  user_id int,
  date_created timestamp DEFAULT CURRENT_TIMESTAMP,
  foreign key (incident_id) references incident(id),
  foreign key (user_id) references user(id)
);

CREATE TABLE reply(
  id int primary key AUTO_INCREMENT,
  `text` text,
  user_id int,
  note_id int,
  date_created timestamp DEFAULT CURRENT_TIMESTAMP,
  foreign key (note_id) references note (id),
  foreign key (user_id) references user (id)
);