
DROP TABLE IF EXISTS tp;
CREATE TABLE tp (
 id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
 current_status SMALLINT DEFAULT 0 COMMENT ' 0-design, 1-connected, 2-assigned, 3-spliced', 
 name_id VARCHAR(50) NULL DEFAULT NULL COMMENT 'terminal field id', 
 mfg VARCHAR(100) NULL DEFAULT NULL COMMENT 'maufacturer', 
 model VARCHAR(100) NULL DEFAULT NULL COMMENT 'Model', 
 capacity VARCHAR(100)  NULL DEFAULT NULL COMMENT 'capacity', 
 connector VARCHAR(100)  NULL DEFAULT 'SM' COMMENT'connector type',
 owner VARCHAR(50)  NULL DEFAULT NULL COMMENT 'owner' ,
 address VARCHAR(200)  NULL DEFAULT NULL COMMENT 'phisical address' ,
 access VARCHAR(100)  NULL DEFAULT NULL COMMENT 'wall wreck pedestal e.t.c', 
 birthday DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'bd',
 last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата последнего обновления',
 latitude  VARCHAR(100)  NULL DEFAULT NULL COMMENT 'latitude',
 longitude VARCHAR(100)  NULL DEFAULT NULL  COMMENT 'longitude'

)COMMENT = 'TP';

DROP TABLE IF EXISTS sp;
CREATE TABLE sp (
 id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
 current_status SMALLINT DEFAULT 0 COMMENT ' 0-design, 1-connected, 2-assigned, 3-spliced', 
 name_id VARCHAR(50) NULL DEFAULT NULL COMMENT 'splice field id', 
 mfg VARCHAR(100) NULL DEFAULT NULL COMMENT 'maufacturer', 
 model VARCHAR(100) NULL DEFAULT NULL COMMENT 'Model', 
 capacity VARCHAR(100)  NULL DEFAULT NULL COMMENT 'capacity',
 spl_type VARCHAR(100)  NULL DEFAULT NULL COMMENT 'single ribbon mixed',
 mount VARCHAR(100)  NULL DEFAULT NULL COMMENT 'wall wreck pedestal e.t.c', 
 address VARCHAR(200)  NULL DEFAULT NULL COMMENT 'phisical address' ,
 birthday DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'bd',
 last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата последнего обновления',
 latitude  VARCHAR(100)  NULL DEFAULT NULL COMMENT 'latitude',
 longitude VARCHAR(100)  NULL DEFAULT NULL  COMMENT 'longitude',
 owner VARCHAR(50)  NULL DEFAULT NULL COMMENT 'owner' 
)COMMENT = 'sp';

DROP TABLE IF EXISTS cable;
CREATE TABLE cable (
 id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
 name_id VARCHAR(50) NULL DEFAULT NULL COMMENT 'splice field id', 
 mfg VARCHAR(100) NULL DEFAULT NULL COMMENT 'maufacturer', 
 model VARCHAR(100) NULL DEFAULT NULL COMMENT 'Model', 
 capacity VARCHAR(100)  NULL DEFAULT NULL COMMENT 'capacity',
 f_type VARCHAR(100)  NULL DEFAULT NULL COMMENT 'mm sm',
 p_type VARCHAR(100)  NULL DEFAULT NULL COMMENT 'mf tube ribbon', 
 c_type VARCHAR(200)  NULL DEFAULT NULL COMMENT 'aerial armored e.t.c' ,
 birthday  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'bd',
 last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата последнего обновления',
 points TEXT  NULL DEFAULT NULL COMMENT 'array of points lot adn lan',
 owner VARCHAR(50)  NULL DEFAULT NULL COMMENT 'owner' ,
 current_status SMALLINT DEFAULT 0 COMMENT ' 0-designed, 1-placed, 2 - has active fibers,  3 - work in progress 4 - abandoned'
 
)COMMENT = 'cable';


DROP TABLE IF EXISTS connections;
CREATE TABLE connections (
 id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
 cab_id   BIGINT UNSIGNED ,
 sp_id   BIGINT UNSIGNED ,
 tp_id   BIGINT UNSIGNED ,
 point   BIGINT UNSIGNED,
 ring BIT DEFAULT 0,
 seq   BIGINT UNSIGNED DEFAULT 0,
 seq_h   BIGINT UNSIGNED DEFAULT 0
)COMMENT = 'connections';

DROP TABLE IF EXISTS log;
CREATE TABLE log (
 id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
 user_id BIGINT NOT NULL DEFAULT 0 COMMENT 'user', 
 item VARCHAR(100) NULL DEFAULT NULL COMMENT 'sp_1 tp_1 cable',  
 date_created  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'date', 
 action VARCHAR(100) NULL DEFAULT NULL COMMENT 'sp_1 tp_1 cable',  
 comments TEXT  DEFAULT NULL COMMENT 'action or comments'
)COMMENT = 'log file';



