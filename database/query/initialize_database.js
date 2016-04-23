exports.initializeQuery = "DROP DATABASE IF EXISTS seating_lucid_agency;\
CREATE DATABASE seating_lucid_agency;\
USE seating_lucid_agency;\
CREATE TABLE cluster (\
  clusterID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  xcoordinate double NOT NULL,\
  ycoordinate double NOT NULL,\
  PRIMARY KEY (clusterID)\
);\
CREATE TABLE company (\
  companyID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  companyName varchar(45) NOT NULL,\
  PRIMARY KEY (companyID)\
);\
CREATE TABLE desk (\
  deskID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  xcoordinate double NOT NULL,\
  ycoordinate double NOT NULL,\
  width double unsigned NOT NULL,\
  height double unsigned NOT NULL,\
  PRIMARY KEY (deskID)\
);\
CREATE TABLE employee (\
  employeeID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  firstName varchar(30) NOT NULL,\
  lastName varchar(30) NOT NULL,\
  email varchar(30) NOT NULL,\
  password varchar(64) NOT NULL,\
  department varchar(30) NOT NULL,\
  title varchar(30) NOT NULL,\
  restroomUsage int(10) unsigned NOT NULL,\
  noisePreference int(10) unsigned NOT NULL,\
  outOfDesk int(10) unsigned NOT NULL,\
  pictureAddress varchar(100) NOT NULL,\
  permissionLevel varchar(30) NOT NULL,\
  haveUpdated tinyint(1) unsigned NOT NULL DEFAULT '0',\
  accountCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
  accountUpdated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
  PRIMARY KEY (employeeID),\
  UNIQUE KEY email_UNIQUE (email)\
);\
CREATE TABLE employee_blacklist (\
  idemployee_blacklist int(10) unsigned NOT NULL,\
  employee_blacklist_teammate_id int(10) unsigned NOT NULL,\
  PRIMARY KEY (idemployee_blacklist,employee_blacklist_teammate_id),\
  CONSTRAINT empidentifer FOREIGN KEY (idemployee_blacklist) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE employee_teammates (\
  idemployee_teammates int(10) unsigned NOT NULL,\
  employee_teammate_id int(10) unsigned NOT NULL,\
  PRIMARY KEY (idemployee_teammates,employee_teammate_id),\
  CONSTRAINT IDE FOREIGN KEY (idemployee_teammates) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE employee_whitelist (\
  idemployee_whitelist int(10) unsigned NOT NULL,\
  employee_whitelist_teammate_id int(10) unsigned NOT NULL,\
  PRIMARY KEY (idemployee_whitelist,employee_whitelist_teammate_id),\
  CONSTRAINT idofemp FOREIGN KEY (idemployee_whitelist) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE floor_plan (\
  floor_planID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  height double unsigned NOT NULL,\
  width double unsigned NOT NULL,\
  numberOfDesks int(10) unsigned NOT NULL,\
  matrix longtext NOT NULL,\
  PRIMARY KEY (floor_planID)\
);\
CREATE TABLE office (\
  officeID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  officeName varchar(45) NOT NULL,\
  officePhoneNumber varchar(45) NOT NULL,\
  officeEmail varchar(45) NOT NULL,\
  officeStreetAddress varchar(45) NOT NULL,\
  officeCity varchar(45) NOT NULL,\
  officeState varchar(45) NOT NULL,\
  officeZipcode varchar(45) NOT NULL,\
  employeeUpdated tinyint(1) unsigned NOT NULL DEFAULT '0',\
  PRIMARY KEY (officeID)\
);\
CREATE TABLE floor_plans (\
  id int(11) NOT NULL AUTO_INCREMENT,\
  office_id int(10) unsigned NOT NULL,\
  name varchar(55) NOT NULL DEFAULT 'New Design',\
  cols int(10) unsigned NOT NULL,\
  rows int(10) unsigned NOT NULL,\
  spots text,\
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,\
  updated_at timestamp NULL DEFAULT NULL,\
  PRIMARY KEY (id),\
  KEY office_id (office_id),\
  CONSTRAINT floor_plans_ibfk_1 FOREIGN KEY (office_id) REFERENCES office (officeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE seating_lucid_agency.range (\
  rangeID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  upper int(10) unsigned NOT NULL,\
  lower int(10) unsigned NOT NULL,\
  PRIMARY KEY (rangeID)\
);\
CREATE TABLE composed_of (\
  IDofCluster int(10) unsigned NOT NULL,\
  IDofDesk int(10) unsigned NOT NULL,\
  PRIMARY KEY (IDofDesk),\
  KEY IDcluster_idx (IDofCluster),\
  CONSTRAINT IDofCluster FOREIGN KEY (IDofCluster) REFERENCES cluster (clusterID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT IDofDesk FOREIGN KEY (IDofDesk) REFERENCES desk (deskID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE has_a_cluster_temp (\
  IDcluster int(10) unsigned NOT NULL,\
  IDrange int(10) unsigned NOT NULL,\
  PRIMARY KEY (IDcluster),\
  KEY rangeID_idx (IDrange),\
  CONSTRAINT IDcluster FOREIGN KEY (IDcluster) REFERENCES cluster (clusterID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT IDrange FOREIGN KEY (IDrange) REFERENCES seating_lucid_agency.range (rangeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE has_a_emp_temp (\
  employeeID int(10) unsigned NOT NULL,\
  rangeID int(10) unsigned NOT NULL,\
  PRIMARY KEY (employeeID),\
  KEY rangeID_idx (rangeID),\
  CONSTRAINT employeeID FOREIGN KEY (employeeID) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT rangeID FOREIGN KEY (rangeID) REFERENCES seating_lucid_agency.range (rangeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE manages (\
  admin_ID int(10) unsigned NOT NULL,\
  company_ID int(10) unsigned NOT NULL,\
  PRIMARY KEY (admin_ID,company_ID),\
  KEY companyID_idx (company_ID),\
  CONSTRAINT ID_employee FOREIGN KEY (admin_ID) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT companyID FOREIGN KEY (company_ID) REFERENCES company (companyID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE organized_by (\
  officePkey int(10) unsigned NOT NULL,\
  floorplanPkey int(10) unsigned NOT NULL,\
  PRIMARY KEY (officePkey),\
  KEY floor_planID_idx (floorplanPkey),\
  CONSTRAINT floor_planID FOREIGN KEY (floorplanPkey) REFERENCES floor_plan (floor_planID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT officePkey FOREIGN KEY (officePkey) REFERENCES office (officeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE owned_by (\
  IDforOffice int(10) unsigned NOT NULL,\
  IDforCompany int(10) unsigned NOT NULL,\
  PRIMARY KEY (IDforOffice),\
  KEY companyKey_idx (IDforCompany),\
  CONSTRAINT companyKey FOREIGN KEY (IDforCompany) REFERENCES company (companyID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT officeID FOREIGN KEY (IDforOffice) REFERENCES office (officeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE password_reset (\
  reset_ID int(10) unsigned NOT NULL AUTO_INCREMENT,\
  token varchar(20) NOT NULL DEFAULT '',\
  time_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
  employee_ID int(10) unsigned NOT NULL,\
  PRIMARY KEY (reset_ID),\
  KEY employee_ID (employee_ID),\
  CONSTRAINT employee_ID FOREIGN KEY (employee_ID) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE seating_charts (\
  id int(10) unsigned NOT NULL AUTO_INCREMENT,\
  name varchar(55) NOT NULL DEFAULT 'New Seating Chart',\
  base_floor_plan text,\
  base_floor_plan_rows int(10) unsigned NOT NULL,\
  base_floor_plan_cols int(10) unsigned NOT NULL,\
  base_floor_plan_name varchar(55) DEFAULT NULL,\
  seating_chart text,\
  office_id int(10) DEFAULT NULL,\
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,\
  updated_at timestamp NULL DEFAULT NULL,\
  PRIMARY KEY (id)\
);\
CREATE TABLE `is_active` (\
  `id_office` int(10) unsigned NOT NULL,\
  `id_seating_chart` int(10) unsigned NOT NULL,\
  PRIMARY KEY (`id_office`),\
  KEY `id_seating_chart_idx` (`id_seating_chart`),\
  CONSTRAINT `id_office` FOREIGN KEY (`id_office`) REFERENCES `office` (`officeID`) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT `id_seating_chart` FOREIGN KEY (`id_seating_chart`) REFERENCES `seating_charts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE sits_at (\
  IDemployee int(10) unsigned NOT NULL,\
  IDdesk int(10) unsigned NOT NULL,\
  PRIMARY KEY (IDdesk),\
  KEY IDemployee_idx (IDemployee),\
  CONSTRAINT IDdesk FOREIGN KEY (IDdesk) REFERENCES desk (deskID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT IDemployee FOREIGN KEY (IDemployee) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE uses (\
  clusterKey int(10) unsigned NOT NULL,\
  floorplanKey int(10) unsigned NOT NULL,\
  PRIMARY KEY (clusterKey),\
  KEY floorplanKey_idx (floorplanKey),\
  CONSTRAINT clusterKey FOREIGN KEY (clusterKey) REFERENCES cluster (clusterID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT floorplanKey FOREIGN KEY (floorplanKey) REFERENCES floor_plan (floor_planID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
CREATE TABLE works_at (\
  employeeKey int(10) unsigned NOT NULL,\
  officeKey int(10) unsigned NOT NULL,\
  PRIMARY KEY (employeeKey),\
  KEY officeID_idx (officeKey),\
  CONSTRAINT employeeKey FOREIGN KEY (employeeKey) REFERENCES employee (employeeID) ON DELETE NO ACTION ON UPDATE NO ACTION,\
  CONSTRAINT officeKey FOREIGN KEY (officeKey) REFERENCES office (officeID) ON DELETE NO ACTION ON UPDATE NO ACTION\
);\
";
