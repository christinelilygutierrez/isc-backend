create database seating_lucid_agency;

use seating_lucid_agency;

-- MySQL dump 10.13  Distrib 5.7.10, for Linux (x86_64)
--
-- Host: localhost    Database: seating_lucid_agency
-- ------------------------------------------------------
-- Server version	5.7.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cluster`
--

DROP TABLE IF EXISTS `cluster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cluster` (
  `clusterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `xcoordinate` double NOT NULL,
  `ycoordinate` double NOT NULL,
  PRIMARY KEY (`clusterID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cluster`
--

LOCK TABLES `cluster` WRITE;
/*!40000 ALTER TABLE `cluster` DISABLE KEYS */;
INSERT INTO `cluster` VALUES (1,5,10),(2,5,1),(3,1,2),(4,6,-2);
/*!40000 ALTER TABLE `cluster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `companyID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `companyName` varchar(45) NOT NULL,
  PRIMARY KEY (`companyID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Lucid Agency, LLC'),(2,'Apple');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `composed_of`
--

DROP TABLE IF EXISTS `composed_of`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `composed_of` (
  `IDofCluster` int(10) unsigned NOT NULL,
  `IDofDesk` int(10) unsigned NOT NULL,
  PRIMARY KEY (`IDofDesk`),
  KEY `IDcluster_idx` (`IDofCluster`),
  CONSTRAINT `IDofCluster` FOREIGN KEY (`IDofCluster`) REFERENCES `cluster` (`clusterID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `IDofDesk` FOREIGN KEY (`IDofDesk`) REFERENCES `desk` (`deskID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `composed_of`
--

LOCK TABLES `composed_of` WRITE;
/*!40000 ALTER TABLE `composed_of` DISABLE KEYS */;
INSERT INTO `composed_of` VALUES (1,1),(1,2),(1,11),(2,3),(2,4),(2,10),(3,5),(3,6),(3,9),(4,7),(4,8);
/*!40000 ALTER TABLE `composed_of` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desk`
--

DROP TABLE IF EXISTS `desk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `desk` (
  `deskID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `xcoordinate` double NOT NULL,
  `ycoordinate` double NOT NULL,
  `width` double unsigned NOT NULL,
  `height` double unsigned NOT NULL,
  PRIMARY KEY (`deskID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desk`
--

LOCK TABLES `desk` WRITE;
/*!40000 ALTER TABLE `desk` DISABLE KEYS */;
INSERT INTO `desk` VALUES (1,1,1,1,1),(2,2,2,2,2),(3,3,3,3,3),(4,4,4,4,4),(5,5,5,5,5),(6,6,6,6,6),(7,7,7,7,7),(8,8,8,8,8),(9,9,9,9,9),(10,10,10,10,10),(11,11,11,11,11);
/*!40000 ALTER TABLE `desk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `employeeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(64) NOT NULL,
  `department` varchar(30) NOT NULL,
  `title` varchar(30) NOT NULL,
  `restroomUsage` int(10) unsigned NOT NULL,
  `noisePreference` int(10) unsigned NOT NULL,
  `outOfDesk` int(10) unsigned NOT NULL,
  `pictureAddress` varchar(30) NOT NULL,
  `permissionLevel` varchar(30) NOT NULL,
  PRIMARY KEY (`employeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Alice','Smith','alice@asu.edu','$2a$10$pHZ/rsnywVRaDeG1D2ZVSumk9nwYPhneZ1kGcmRLU9GNwTIoB.aHa','health','physician',0,0,0,'alice.jpg','superadmin'),(2,'Bob','Smith','bob@asu.edu','$2a$10$Y6PQgRiZDANoFhKOAKqsGefRTEIqEP4bJJe28mG8jOks7VavxBFuS','wealth','CEO',0,0,0,'bob.jpg','admin'),(3,'Barbara','Gordon','barbara@asu.edu','$2a$10$fOCW/5LvYv4DKrXeUD7/fetLiCLTtmmjH5YkKfLNBrx1VjV3RYOpW','wealth','CEO',0,0,0,'barbara.jpg','user'),(4,'charles','charles','charles@asu.edu','sha1$be28842e$1$6abff9f689223c662127bd51af7cd491031654c2','Chemistry','Supervisor',0,0,0,'charles.jpg','medium'),(5,'bill','bill','bill@asu.edu','sha1$0ee9799b$1$03e9eefac934466a36904328bf18678cd2dd06fd','wealth','CEO',0,0,0,'bill.jpg','high'),(6,'charlie','charlie','charlie@asu.edu','sha1$007b09ec$1$325d57f3a99984305d133bfffe3626f3ede62522','wealth','CEO',0,0,0,'charlie.jpg','very high'),(7,'cassy','cassy','cassy@asu.edu','sha1$858fe70b$1$834e1740770001d8449683f7fe07b2dbda94837d','wealth','CEO',0,0,0,'cassy.jpg','super high'),(8,'david','david','david@asu.edu','sha1$6af5788e$1$4ba64287f8c3fbfa874eab38a48e0d899fff4677','wealth','CEO',0,0,0,'david.jpg','so high'),(9,'dan','dan','dan@asu.edu','sha1$a476f0bd$1$4fd38639b82ff84f3d18d6476c2f3ce1fffaf853','wealth','CEO',0,0,0,'dan.jpg','higher than high'),(10,'debra','debra','debra@asu.edu','sha1$fc951a03$1$0c4a4aac4e4e011ffd94a4aaa6b2753a0eca03a1','wealth','CEO',0,0,0,'debra.jpg','sub-low'),(11,'eve','eve','eve@asu.edu','sha1$c21e216e$1$7a79ad8253d425e14a51d698c0aea193ab9308f8','wealth','CEO',0,0,0,'eve.jpg','none'),(12,'Anna','Banana','annabanana@aol.com','sha1$f2cfadc5$1$e3ecea57bb439762c50cfe39b608004bccd80498','Science','Manager',0,0,0,'anna.jpg','so high');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_attribute`
--

DROP TABLE IF EXISTS `employee_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_attribute` (
  `idemployee_attribute` int(10) unsigned NOT NULL,
  `employee_attribute` varchar(45) NOT NULL,
  PRIMARY KEY (`idemployee_attribute`,`employee_attribute`),
  CONSTRAINT `empID` FOREIGN KEY (`idemployee_attribute`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_attribute`
--

LOCK TABLES `employee_attribute` WRITE;
/*!40000 ALTER TABLE `employee_attribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_blacklist`
--

DROP TABLE IF EXISTS `employee_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_blacklist` (
  `idemployee_blacklist` int(10) unsigned NOT NULL,
  `employee_blacklist_teammate_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idemployee_blacklist`,`employee_blacklist_teammate_id`),
  CONSTRAINT `empidentifer` FOREIGN KEY (`idemployee_blacklist`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_blacklist`
--

LOCK TABLES `employee_blacklist` WRITE;
/*!40000 ALTER TABLE `employee_blacklist` DISABLE KEYS */;
INSERT INTO `employee_blacklist` VALUES (1,6),(2,1),(3,4),(4,3),(5,6),(6,5),(7,8),(8,7),(9,10),(9,11),(10,9),(10,11),(11,9),(11,10);
/*!40000 ALTER TABLE `employee_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_teammates`
--

DROP TABLE IF EXISTS `employee_teammates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_teammates` (
  `idemployee_teammates` int(10) unsigned NOT NULL,
  `employee_teammate_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idemployee_teammates`,`employee_teammate_id`),
  CONSTRAINT `IDE` FOREIGN KEY (`idemployee_teammates`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_teammates`
--

LOCK TABLES `employee_teammates` WRITE;
/*!40000 ALTER TABLE `employee_teammates` DISABLE KEYS */;
INSERT INTO `employee_teammates` VALUES (1,2),(1,3),(2,1),(2,3),(3,1),(3,2),(4,5),(4,6),(5,4),(5,6),(6,4),(6,5),(7,8),(7,9),(8,7),(8,9),(9,7),(9,8),(10,11),(11,10);
/*!40000 ALTER TABLE `employee_teammates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_whitelist`
--

DROP TABLE IF EXISTS `employee_whitelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_whitelist` (
  `idemployee_whitelist` int(10) unsigned NOT NULL,
  `employee_whitelist_teammate_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idemployee_whitelist`,`employee_whitelist_teammate_id`),
  CONSTRAINT `idofemp` FOREIGN KEY (`idemployee_whitelist`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_whitelist`
--

LOCK TABLES `employee_whitelist` WRITE;
/*!40000 ALTER TABLE `employee_whitelist` DISABLE KEYS */;
INSERT INTO `employee_whitelist` VALUES (1,2),(1,3),(1,4),(2,1),(2,3),(2,4),(3,1),(3,2),(3,4),(4,1),(4,2),(4,3),(5,6),(6,5),(7,8),(8,7),(9,10),(9,11),(10,9),(10,11),(11,9),(11,10);
/*!40000 ALTER TABLE `employee_whitelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floor_plan`
--

DROP TABLE IF EXISTS `floor_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floor_plan` (
  `floor_planID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `height` double unsigned NOT NULL,
  `width` double unsigned NOT NULL,
  `numberOfDesks` int(10) unsigned NOT NULL,
  `matrix` longtext NOT NULL,
  PRIMARY KEY (`floor_planID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floor_plan`
--

LOCK TABLES `floor_plan` WRITE;
/*!40000 ALTER TABLE `floor_plan` DISABLE KEYS */;
INSERT INTO `floor_plan` VALUES (1,500,750,11,'{}');
/*!40000 ALTER TABLE `floor_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `has_a_cluster_temp`
--

DROP TABLE IF EXISTS `has_a_cluster_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `has_a_cluster_temp` (
  `IDcluster` int(10) unsigned NOT NULL,
  `IDrange` int(10) unsigned NOT NULL,
  PRIMARY KEY (`IDcluster`),
  KEY `rangeID_idx` (`IDrange`),
  CONSTRAINT `IDcluster` FOREIGN KEY (`IDcluster`) REFERENCES `cluster` (`clusterID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `IDrange` FOREIGN KEY (`IDrange`) REFERENCES `range` (`rangeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `has_a_cluster_temp`
--

LOCK TABLES `has_a_cluster_temp` WRITE;
/*!40000 ALTER TABLE `has_a_cluster_temp` DISABLE KEYS */;
INSERT INTO `has_a_cluster_temp` VALUES (1,3),(3,3),(2,4),(4,7);
/*!40000 ALTER TABLE `has_a_cluster_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `has_a_emp_temp`
--

DROP TABLE IF EXISTS `has_a_emp_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `has_a_emp_temp` (
  `employeeID` int(10) unsigned NOT NULL,
  `rangeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`employeeID`),
  KEY `rangeID_idx` (`rangeID`),
  CONSTRAINT `employeeID` FOREIGN KEY (`employeeID`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `rangeID` FOREIGN KEY (`rangeID`) REFERENCES `range` (`rangeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `has_a_emp_temp`
--

LOCK TABLES `has_a_emp_temp` WRITE;
/*!40000 ALTER TABLE `has_a_emp_temp` DISABLE KEYS */;
INSERT INTO `has_a_emp_temp` VALUES (1,3),(2,3),(3,4),(4,4),(10,4),(11,4),(5,5),(6,5),(7,6),(8,6),(9,7);
/*!40000 ALTER TABLE `has_a_emp_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office`
--

DROP TABLE IF EXISTS `office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `office` (
  `officeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `officeName` varchar(45) NOT NULL,
  `officePhoneNumber` varchar(45) NOT NULL,
  `officeEmail` varchar(45) NOT NULL,
  `officeStreetAddress` varchar(45) NOT NULL,
  `officeCity` varchar(45) NOT NULL,
  `officeState` varchar(45) NOT NULL,
  `officeZipcode` varchar(45) NOT NULL,
  PRIMARY KEY (`officeID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office`
--

LOCK TABLES `office` WRITE;
/*!40000 ALTER TABLE `office` DISABLE KEYS */;
INSERT INTO `office` VALUES (1,'Second Floor','(480) 219-7257','lucid@lucidagency.com','117 E. 5th St., Second Floor','Tempe','AZ','85281'),(2,'Apple Campus','(800) 412-1234','apple@yahoo.com','1 Infinite Loop','Cupertino','CA','95014');
/*!40000 ALTER TABLE `office` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organized_by`
--

DROP TABLE IF EXISTS `organized_by`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organized_by` (
  `officePkey` int(10) unsigned NOT NULL,
  `floorplanPkey` int(10) unsigned NOT NULL,
  PRIMARY KEY (`officePkey`),
  KEY `floor_planID_idx` (`floorplanPkey`),
  CONSTRAINT `floor_planID` FOREIGN KEY (`floorplanPkey`) REFERENCES `floor_plan` (`floor_planID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `officePkey` FOREIGN KEY (`officePkey`) REFERENCES `office` (`officeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organized_by`
--

LOCK TABLES `organized_by` WRITE;
/*!40000 ALTER TABLE `organized_by` DISABLE KEYS */;
INSERT INTO `organized_by` VALUES (1,1);
/*!40000 ALTER TABLE `organized_by` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owned_by`
--

DROP TABLE IF EXISTS `owned_by`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owned_by` (
  `IDforOffice` int(10) unsigned NOT NULL,
  `IDforCompany` int(10) unsigned NOT NULL,
  PRIMARY KEY (`IDforOffice`),
  KEY `companyKey_idx` (`IDforCompany`),
  CONSTRAINT `companyKey` FOREIGN KEY (`IDforCompany`) REFERENCES `company` (`companyID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `officeID` FOREIGN KEY (`IDforOffice`) REFERENCES `office` (`officeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owned_by`
--

LOCK TABLES `owned_by` WRITE;
/*!40000 ALTER TABLE `owned_by` DISABLE KEYS */;
INSERT INTO `owned_by` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `owned_by` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `range`
--

DROP TABLE IF EXISTS `range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `range` (
  `rangeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `upper` int(10) unsigned NOT NULL,
  `lower` int(10) unsigned NOT NULL,
  PRIMARY KEY (`rangeID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `range`
--

LOCK TABLES `range` WRITE;
/*!40000 ALTER TABLE `range` DISABLE KEYS */;
INSERT INTO `range` VALUES (3,1,0),(4,2,1),(5,4,3),(6,6,5),(7,8,7);
/*!40000 ALTER TABLE `range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sits_at`
--

DROP TABLE IF EXISTS `sits_at`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sits_at` (
  `IDemployee` int(10) unsigned NOT NULL,
  `IDdesk` int(10) unsigned NOT NULL,
  PRIMARY KEY (`IDdesk`),
  KEY `IDemployee_idx` (`IDemployee`),
  CONSTRAINT `IDdesk` FOREIGN KEY (`IDdesk`) REFERENCES `desk` (`deskID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `IDemployee` FOREIGN KEY (`IDemployee`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sits_at`
--

LOCK TABLES `sits_at` WRITE;
/*!40000 ALTER TABLE `sits_at` DISABLE KEYS */;
INSERT INTO `sits_at` VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10),(11,11);
/*!40000 ALTER TABLE `sits_at` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uses`
--

DROP TABLE IF EXISTS `uses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uses` (
  `clusterKey` int(10) unsigned NOT NULL,
  `floorplanKey` int(10) unsigned NOT NULL,
  PRIMARY KEY (`clusterKey`),
  KEY `floorplanKey_idx` (`floorplanKey`),
  CONSTRAINT `clusterKey` FOREIGN KEY (`clusterKey`) REFERENCES `cluster` (`clusterID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `floorplanKey` FOREIGN KEY (`floorplanKey`) REFERENCES `floor_plan` (`floor_planID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uses`
--

LOCK TABLES `uses` WRITE;
/*!40000 ALTER TABLE `uses` DISABLE KEYS */;
INSERT INTO `uses` VALUES (1,1),(2,1),(3,1),(4,1);
/*!40000 ALTER TABLE `uses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `works_at`
--

DROP TABLE IF EXISTS `works_at`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `works_at` (
  `employeeKey` int(10) unsigned NOT NULL,
  `officeKey` int(10) unsigned NOT NULL,
  PRIMARY KEY (`employeeKey`),
  KEY `officeID_idx` (`officeKey`),
  CONSTRAINT `employeeKey` FOREIGN KEY (`employeeKey`) REFERENCES `employee` (`employeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `officeKey` FOREIGN KEY (`officeKey`) REFERENCES `office` (`officeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `works_at`
--

LOCK TABLES `works_at` WRITE;
/*!40000 ALTER TABLE `works_at` DISABLE KEYS */;
INSERT INTO `works_at` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,2);
/*!40000 ALTER TABLE `works_at` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-01 21:51:21
