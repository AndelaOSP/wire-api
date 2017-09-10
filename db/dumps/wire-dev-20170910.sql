ALTER TABLE `incident` 
DROP FOREIGN KEY `incident_ibfk_4`;
ALTER TABLE `incident` 
CHANGE COLUMN `status_id` `status_id` INT(11) NULL DEFAULT 1 COMMENT '' ;
ALTER TABLE `incident` 
ADD CONSTRAINT `incident_ibfk_4`
  FOREIGN KEY (`status_id`)
  REFERENCES `incident_status` (`id`);
