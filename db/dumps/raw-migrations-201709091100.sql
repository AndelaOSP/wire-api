CREATE TABLE sentiment(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20)
);

CREATE TABLE incident_sentiment(
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT,
  sentiment_id INT,
  user_id INT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incident(id),
  FOREIGN KEY (sentiment_id) REFERENCES sentiment(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO `sentiment` (`name`) VALUES ('Not Satisfied');
INSERT INTO `sentiment` (`name`) VALUES ('Neutral');
INSERT INTO `sentiment` (`name`) VALUES ('Not Satisfied');
