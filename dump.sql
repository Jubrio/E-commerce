-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: guyagod_marketplace
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adresses`
--

DROP TABLE IF EXISTS `adresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `code_postal` varchar(20) DEFAULT NULL,
  `est_defaut` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_adresses_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adresses`
--

LOCK TABLES `adresses` WRITE;
/*!40000 ALTER TABLE `adresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `adresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `note` tinyint(4) NOT NULL CHECK (`note` between 1 and 5),
  `titre` varchar(150) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `verifie` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_avis` (`user_id`,`produit_id`),
  KEY `idx_avis_produit` (`produit_id`),
  CONSTRAINT `avis_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `avis_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
INSERT INTO `avis` VALUES (1,2,1,5,'Excellent','Très bon téléphone',1,'2026-05-19 12:53:52'),(2,4,2,4,'Bon produit','Performant',1,'2026-05-19 12:53:52'),(3,2,5,5,'Top','Chaussures confortables',1,'2026-05-19 12:53:52');
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_slug` (`slug`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Informatique','informatique','PC et accessoires',NULL,NULL,'2026-05-19 12:53:52'),(2,'Téléphones','telephones','Smartphones',NULL,NULL,'2026-05-19 12:53:52'),(3,'Mode','mode','Vêtements',NULL,NULL,'2026-05-19 12:53:52'),(5,'Sport','sport','Articles de sport',NULL,NULL,'2026-05-19 12:53:52'),(8,' Vêtement','-vetement',' Vêtement',NULL,NULL,'2026-05-23 07:43:08'),(9,'Accessoires','accessoires','Accessoires des telephone',NULL,2,'2026-05-23 08:05:08'),(10,'Accessoires informatique','accessoires-informatique','Accessoires informatique',NULL,1,'2026-05-23 08:07:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commande_items`
--

DROP TABLE IF EXISTS `commande_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commande_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `nom_produit` varchar(255) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL,
  `sous_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produit_id` (`produit_id`),
  KEY `idx_commande_items` (`commande_id`),
  CONSTRAINT `commande_items_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `commande_items_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commande_items`
--

LOCK TABLES `commande_items` WRITE;
/*!40000 ALTER TABLE `commande_items` DISABLE KEYS */;
INSERT INTO `commande_items` VALUES (1,1,1,'iPhone 15 Pro',1,699.00,699.00),(2,2,1,'iPhone 15 Pro',1,699.00,699.00),(3,3,14,'power bank ',1,30.00,30.00),(4,3,15,'Souris',1,25.00,25.00),(5,4,15,'Souris',2,25.00,50.00),(6,5,15,'Souris',3,25.00,75.00),(7,6,4,'Dell Inspiron',1,499.00,499.00),(8,6,8,'SAMSUNG S21',1,299.00,299.00),(9,7,4,'Dell Inspiron',1,499.00,499.00),(10,7,5,'Nike Air Max',1,249.00,249.00),(11,8,14,'power bank ',20,30.00,600.00),(12,9,9,'Adidas Runner',1,129.00,129.00),(13,9,10,'Dell Inspiron 2',1,399.00,399.00);
/*!40000 ALTER TABLE `commande_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference_commande` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `total_avant_coupon` decimal(10,2) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `statut` enum('en_attente','payee','expediee','livree','annulee','remboursee') DEFAULT 'en_attente',
  `adresse_livraison` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mode_paiement` varchar(50) DEFAULT NULL,
  `notes_client` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_commande` (`reference_commande`),
  KEY `coupon_id` (`coupon_id`),
  KEY `idx_commandes_user` (`user_id`),
  KEY `idx_commandes_statut` (`statut`),
  KEY `idx_commandes_ref` (`reference_commande`),
  CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `commandes_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commandes`
--

LOCK TABLES `commandes` WRITE;
/*!40000 ALTER TABLE `commandes` DISABLE KEYS */;
INSERT INTO `commandes` VALUES (1,'GUY-20260520-46428',6,699.00,699.00,NULL,'en_attente','qwerty','032 88 555 88','stripe','laise u ','2026-05-20 08:21:47','2026-05-20 08:21:47'),(2,'GUY-20260520-71937',6,699.00,699.00,NULL,'livree','400 3e rue','032 55 666 55','virement','a moi','2026-05-20 08:27:11','2026-05-23 09:10:01'),(3,'GUY-20260524-60507',11,55.00,55.00,NULL,'en_attente','qwertyu','032 55 666 22','stripe','laisse ra moi','2026-05-24 10:59:56','2026-05-24 10:59:56'),(4,'GUY-20260524-17210',11,50.00,50.00,NULL,'en_attente','qwerty','0322 555 8 88 ','stripe','qwertyu','2026-05-24 11:00:53','2026-05-24 11:00:53'),(5,'GUY-20260524-41177',11,75.00,75.00,NULL,'en_attente','qwertyu','741852963','stripe','qwert','2026-05-24 11:09:55','2026-05-24 11:09:55'),(6,'GUY-20260524-42430',6,798.00,798.00,NULL,'en_attente','lot 310 ter p/elle 14/31 ','+554 66 555 656 55','stripe','a moi en personne ','2026-05-24 11:20:24','2026-05-24 11:20:24'),(7,'GUY-20260524-83354',6,748.00,748.00,NULL,'livree','lot 310 ter p/elle 14/31 ambohijafy','+554 222 333 6 55','stripe','a moi','2026-05-24 11:45:40','2026-05-26 06:20:21'),(8,'GUY-20260524-13619',11,600.00,600.00,NULL,'payee','lot 3100','552 333 222 555 55','stripe','qwertyuio','2026-05-24 12:48:57','2026-05-24 12:49:12'),(9,'GUY-20260531-31651',13,528.00,528.00,NULL,'payee','Lot 320 p/elle 210','+594656332550','stripe','a moi en personne','2026-05-31 19:48:34','2026-05-31 19:48:59');
/*!40000 ALTER TABLE `commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendeur_id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `montant_vente` decimal(10,2) NOT NULL,
  `taux` decimal(5,2) NOT NULL,
  `montant_commission` decimal(10,2) NOT NULL,
  `statut` enum('en_attente','versee') DEFAULT 'en_attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `idx_commissions_vendeur` (`vendeur_id`),
  CONSTRAINT `commissions_ibfk_1` FOREIGN KEY (`vendeur_id`) REFERENCES `users` (`id`),
  CONSTRAINT `commissions_ibfk_2` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissions`
--

LOCK TABLES `commissions` WRITE;
/*!40000 ALTER TABLE `commissions` DISABLE KEYS */;
INSERT INTO `commissions` VALUES (1,3,1,699.00,5.00,34.95,'en_attente','2026-05-20 08:21:47'),(2,3,2,699.00,5.00,34.95,'en_attente','2026-05-20 08:27:11'),(3,1,3,30.00,5.00,1.50,'en_attente','2026-05-24 10:59:56'),(4,1,3,25.00,5.00,1.25,'en_attente','2026-05-24 10:59:56'),(5,1,4,50.00,5.00,2.50,'en_attente','2026-05-24 11:00:53'),(6,1,5,75.00,5.00,3.75,'en_attente','2026-05-24 11:09:55'),(7,3,6,499.00,5.00,24.95,'en_attente','2026-05-24 11:20:24'),(8,1,6,299.00,5.00,14.95,'en_attente','2026-05-24 11:20:24'),(9,3,7,499.00,5.00,24.95,'en_attente','2026-05-24 11:45:40'),(10,3,7,249.00,5.00,12.45,'en_attente','2026-05-24 11:45:40'),(11,1,8,600.00,5.00,30.00,'en_attente','2026-05-24 12:48:57'),(12,1,9,129.00,5.00,6.45,'en_attente','2026-05-31 19:48:34'),(13,1,9,399.00,5.00,19.95,'en_attente','2026-05-31 19:48:34');
/*!40000 ALTER TABLE `commissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_utilisations`
--

DROP TABLE IF EXISTS `coupon_utilisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon_utilisations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_coupon_user` (`coupon_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `commande_id` (`commande_id`),
  CONSTRAINT `coupon_utilisations_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  CONSTRAINT `coupon_utilisations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `coupon_utilisations_ibfk_3` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_utilisations`
--

LOCK TABLES `coupon_utilisations` WRITE;
/*!40000 ALTER TABLE `coupon_utilisations` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_utilisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type_reduction` enum('pourcentage','montant_fixe') DEFAULT 'pourcentage',
  `reduction` decimal(10,2) NOT NULL,
  `minimum_commande` decimal(10,2) DEFAULT 0.00,
  `usage_max` int(11) DEFAULT NULL,
  `usage_actuel` int(11) DEFAULT 0,
  `expiration` datetime DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME10','pourcentage',10.00,0.00,100,0,NULL,1,'2026-05-19 12:53:52'),(2,'BLACKFRIDAY','pourcentage',20.00,100000.00,50,0,NULL,1,'2026-05-19 12:53:52'),(3,'VIP5000','montant_fixe',5000.00,50000.00,200,0,NULL,1,'2026-05-19 12:53:52');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_verifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mot_de_passe_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_code` (`code`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoris`
--

DROP TABLE IF EXISTS `favoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favori` (`user_id`,`produit_id`),
  KEY `produit_id` (`produit_id`),
  KEY `idx_favoris_user` (`user_id`),
  CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoris`
--

LOCK TABLES `favoris` WRITE;
/*!40000 ALTER TABLE `favoris` DISABLE KEYS */;
INSERT INTO `favoris` VALUES (1,2,1,'2026-05-19 12:53:52'),(2,2,2,'2026-05-19 12:53:52'),(3,4,5,'2026-05-19 12:53:52'),(5,1,1,'2026-05-20 08:09:20');
/*!40000 ALTER TABLE `favoris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livraisons`
--

DROP TABLE IF EXISTS `livraisons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `livraisons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `transporteur` varchar(100) DEFAULT NULL,
  `numero_suivi` varchar(255) DEFAULT NULL,
  `statut` enum('preparation','expedie','en_transit','livre','echec') DEFAULT 'preparation',
  `date_expedition` datetime DEFAULT NULL,
  `date_livraison_estimee` date DEFAULT NULL,
  `date_livraison_reelle` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commande_id` (`commande_id`),
  CONSTRAINT `livraisons_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livraisons`
--

LOCK TABLES `livraisons` WRITE;
/*!40000 ALTER TABLE `livraisons` DISABLE KEYS */;
INSERT INTO `livraisons` VALUES (1,1,NULL,NULL,'preparation',NULL,NULL,NULL),(2,2,'Mr - Trevor Junior','6QTrevor','livre','2026-05-23 11:57:30','2026-05-24','2026-05-23 12:10:01'),(3,3,NULL,NULL,'preparation',NULL,NULL,NULL),(4,4,NULL,NULL,'preparation',NULL,NULL,NULL),(5,5,NULL,NULL,'preparation',NULL,NULL,NULL),(6,6,NULL,NULL,'preparation',NULL,NULL,NULL),(7,7,'Mr commons ','6SSK','livre','2026-05-26 09:19:57','2026-05-28','2026-05-26 09:20:21'),(8,8,NULL,NULL,'preparation',NULL,NULL,NULL),(9,9,NULL,NULL,'preparation',NULL,NULL,NULL);
/*!40000 ALTER TABLE `livraisons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_connexions`
--

DROP TABLE IF EXISTS `logs_connexions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs_connexions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `adresse_ip` varchar(100) DEFAULT NULL,
  `appareil` varchar(255) DEFAULT NULL,
  `succes` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_logs_user` (`user_id`),
  CONSTRAINT `logs_connexions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_connexions`
--

LOCK TABLES `logs_connexions` WRITE;
/*!40000 ALTER TABLE `logs_connexions` DISABLE KEYS */;
INSERT INTO `logs_connexions` VALUES (1,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-19 12:54:31'),(2,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-19 13:16:34'),(3,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 06:36:27'),(4,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 06:36:36'),(5,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 06:37:03'),(6,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 06:51:32'),(7,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:28:40'),(8,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:41:40'),(9,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:42:00'),(10,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:42:37'),(11,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',0,'2026-05-20 07:42:59'),(12,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:43:04'),(13,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:43:52'),(14,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:46:47'),(15,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:48:07'),(16,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:52:58'),(17,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:53:11'),(18,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:53:41'),(19,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:59:27'),(20,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 07:59:39'),(21,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:00:01'),(22,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:01:32'),(23,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:03:10'),(24,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:07:46'),(25,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:09:27'),(26,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:09:39'),(27,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:10:03'),(28,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:10:37'),(29,1,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-20 08:33:39'),(30,6,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-20 08:33:52'),(31,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-20 08:53:42'),(32,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 09:56:30'),(33,6,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-22 10:07:37'),(34,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',0,'2026-05-22 10:17:06'),(35,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 10:17:10'),(36,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 10:21:15'),(37,NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-22 10:30:21'),(38,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 10:42:17'),(39,NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-22 10:51:42'),(40,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 10:53:52'),(41,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:04:37'),(42,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:30:45'),(43,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:38:31'),(44,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:40:01'),(45,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:40:09'),(46,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',0,'2026-05-22 11:40:26'),(47,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:40:31'),(48,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:41:21'),(49,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:41:56'),(50,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 11:45:51'),(51,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:37:27'),(52,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:37:50'),(53,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:38:19'),(54,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:42:43'),(55,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:44:58'),(56,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 16:45:56'),(57,10,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 18:07:54'),(58,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 18:14:38'),(59,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 18:16:27'),(60,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-22 18:33:37'),(61,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',0,'2026-05-23 07:29:10'),(62,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 07:34:01'),(63,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 07:41:17'),(64,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 07:56:52'),(65,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:00:00'),(66,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:00:55'),(67,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:01:43'),(68,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:04:07'),(69,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:58:07'),(70,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-23 08:59:05'),(71,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 10:59:31'),(72,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 11:18:18'),(73,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 11:19:24'),(74,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 11:47:21'),(75,6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 11:48:02'),(76,6,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-24 12:43:28'),(77,1,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',1,'2026-05-24 12:45:29'),(78,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 12:48:23'),(79,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 12:50:38'),(80,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 12:55:45'),(81,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 13:26:58'),(82,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-24 13:35:05'),(83,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-25 12:52:18'),(84,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-25 13:00:08'),(85,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-25 13:10:49'),(86,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-25 13:11:03'),(87,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-25 13:16:10'),(88,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',0,'2026-05-26 06:08:27'),(89,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:08:33'),(90,11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:08:44'),(91,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:08:56'),(92,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:16:14'),(93,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:16:49'),(94,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:18:11'),(95,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:20:43'),(96,3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-26 06:20:54'),(97,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-31 18:56:39'),(98,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-31 18:57:26'),(99,13,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1,'2026-05-31 19:34:49');
/*!40000 ALTER TABLE `logs_connexions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marques`
--

DROP TABLE IF EXISTS `marques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marques`
--

LOCK TABLES `marques` WRITE;
/*!40000 ALTER TABLE `marques` DISABLE KEYS */;
INSERT INTO `marques` VALUES (1,'Apple','apple',NULL),(2,'Samsung','samsung',NULL),(3,'Xiaomi','xiaomi',NULL),(4,'HP','hp',NULL),(5,'Dell','dell',NULL),(6,'Nike','nike',NULL),(7,'Adidas','adidas',NULL);
/*!40000 ALTER TABLE `marques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `expediteur_id` int(11) NOT NULL,
  `destinataire_id` int(11) NOT NULL,
  `commande_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `expediteur_id` (`expediteur_id`),
  KEY `idx_messages_destinataire` (`destinataire_id`,`lu`),
  KEY `idx_messages_commande` (`commande_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,11,1,NULL,'bonjour, puis-je en savoir plus sur votre produit?',1,'2026-05-23 07:58:34'),(2,11,1,NULL,'le plus vite est mieux s\'il vous plait.',1,'2026-05-23 07:59:02'),(3,11,1,NULL,'bonjour comment puis-je vous aidez?',1,'2026-05-23 08:00:27'),(4,1,11,NULL,'bonjour, comment puis-je vous aidez?',1,'2026-05-23 08:01:35'),(5,11,1,NULL,'peut-on en savoir plus sur le power bank',1,'2026-05-23 08:03:59'),(6,6,1,NULL,'bonjour',1,'2026-05-24 12:43:05');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `lien` varchar(255) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`,`lu`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'system','Bienvenue Admin',NULL,1,'2026-05-19 12:53:52'),(2,2,'info','Bienvenue sur la plateforme',NULL,0,'2026-05-19 12:53:52'),(3,3,'promo','Nouvelle promotion disponible',NULL,1,'2026-05-19 12:53:52'),(5,6,'bienvenue','Bienvenue sur Guyagod, King ! Votre compte est créé.','/profil',1,'2026-05-19 13:16:31'),(6,6,'nouvelle_commande','Votre commande GUY-20260520-46428 a été passée avec succès.','/commandes/1',1,'2026-05-20 08:21:47'),(7,6,'nouvelle_commande','Votre commande GUY-20260520-71937 a été passée avec succès.','/commandes/2',1,'2026-05-20 08:27:11'),(11,10,'bienvenue','Bienvenue sur Bazar Guyane, SATORU ! Votre compte est activé.','/profil',0,'2026-05-22 18:07:50'),(12,11,'bienvenue','Bienvenue sur Bazar Guyane, RAZAKANIRINA ! Votre compte est activé.','/profil',1,'2026-05-23 07:33:31'),(13,6,'commande_expediee','Votre commande GUY-20260520-71937 a été expédiée via Mr - Trevor Junior. Suivi : 6QTrevor','/commandes/2',1,'2026-05-23 08:57:30'),(14,6,'commande_livree','Votre commande GUY-20260520-71937 a été livrée !','/commandes/2',0,'2026-05-23 09:10:01'),(15,11,'nouvelle_commande','Votre commande GUY-20260524-60507 a été passée avec succès.','/commandes/3',1,'2026-05-24 10:59:56'),(16,11,'nouvelle_commande','Votre commande GUY-20260524-17210 a été passée avec succès.','/commandes/4',1,'2026-05-24 11:00:53'),(17,11,'nouvelle_commande','Votre commande GUY-20260524-41177 a été passée avec succès.','/commandes/5',1,'2026-05-24 11:09:55'),(18,6,'nouvelle_commande','Votre commande GUY-20260524-42430 a été passée avec succès.','/commandes/6',0,'2026-05-24 11:20:24'),(19,6,'nouvelle_commande','Votre commande GUY-20260524-83354 a été passée avec succès.','/commandes/7',1,'2026-05-24 11:45:40'),(20,11,'nouvelle_commande','Votre commande GUY-20260524-13619 a été passée avec succès.','/commandes/8',1,'2026-05-24 12:48:57'),(21,6,'commande_expediee','Votre commande GUY-20260524-83354 a été expédiée via Mr commons . Suivi : 6SSK','/commandes/7',0,'2026-05-26 06:19:57'),(22,6,'commande_livree','Votre commande GUY-20260524-83354 a été livrée !','/commandes/7',0,'2026-05-26 06:20:21'),(23,13,'bienvenue','Bienvenue sur Bazar Guyane, mamalina ! Votre compte est activé.','/profil',0,'2026-05-31 19:34:43'),(24,13,'nouvelle_commande','Votre commande GUY-20260531-31651 a été passée avec succès.','/commandes/9',0,'2026-05-31 19:48:34');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `methode` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `statut` enum('en_attente','reussi','echoue','rembourse') DEFAULT 'en_attente',
  `payload_stripe` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `idx_paiements_commande` (`commande_id`),
  KEY `idx_paiements_statut` (`statut`),
  CONSTRAINT `paiements_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements`
--

LOCK TABLES `paiements` WRITE;
/*!40000 ALTER TABLE `paiements` DISABLE KEYS */;
INSERT INTO `paiements` VALUES (1,5,75.00,'stripe','cs_test_a18pNax3KWHKDWuXKdleVEdKOItedk0w0TeuY1Hybh8HwKalMoo4cgvNjH','en_attente',NULL,'2026-05-24 11:09:57'),(2,6,798.00,'stripe','cs_test_b1oVAVpA5PD78j5H5qL6TqOm2mDfxp3HBjildXEvEa7MYYkXI0CDKNPnjy','en_attente',NULL,'2026-05-24 11:20:26'),(3,7,748.00,'stripe','cs_test_b189jSrLBouqRSCILsBXgxvkVYyVLCgWTov7AGr0BC5It5LrTVO8gLv4mr','reussi','{\"id\":\"cs_test_b189jSrLBouqRSCILsBXgxvkVYyVLCgWTov7AGr0BC5It5LrTVO8gLv4mr\",\"object\":\"checkout.session\",\"adaptive_pricing\":{\"enabled\":true},\"after_expiration\":null,\"allow_promotion_codes\":null,\"amount_subtotal\":74800,\"amount_total\":74800,\"automatic_tax\":{\"enabled\":false,\"liability\":null,\"provider\":null,\"status\":null},\"billing_address_collection\":null,\"branding_settings\":{\"background_color\":\"#ffffff\",\"border_style\":\"rounded\",\"button_color\":\"#0074d4\",\"display_name\":\"environnement de test Web devellopeur Test\",\"font_family\":\"default\",\"icon\":null,\"logo\":null},\"cancel_url\":\"http://localhost:3000/panier\",\"client_reference_id\":null,\"client_secret\":null,\"collected_information\":null,\"consent\":null,\"consent_collection\":null,\"created\":1779622964,\"currency\":\"eur\",\"currency_conversion\":null,\"custom_fields\":[],\"custom_text\":{\"after_submit\":null,\"shipping_address\":null,\"submit\":null,\"terms_of_service_acceptance\":null},\"customer\":null,\"customer_account\":null,\"customer_creation\":\"if_required\",\"customer_details\":{\"address\":{\"city\":null,\"country\":\"MG\",\"line1\":null,\"line2\":null,\"postal_code\":null,\"state\":null},\"business_name\":null,\"email\":\"kingvonisation@gmail.com\",\"individual_name\":null,\"name\":\"king man\",\"phone\":null,\"tax_exempt\":\"none\",\"tax_ids\":[]},\"customer_email\":null,\"discounts\":[],\"expires_at\":1779709364,\"integration_identifier\":null,\"invoice\":null,\"invoice_creation\":{\"enabled\":false,\"invoice_data\":{\"account_tax_ids\":null,\"custom_fields\":null,\"description\":null,\"footer\":null,\"issuer\":null,\"metadata\":{},\"rendering_options\":null}},\"livemode\":false,\"locale\":null,\"managed_payments\":{\"enabled\":false},\"metadata\":{\"commande_id\":\"7\",\"user_id\":\"6\"},\"mode\":\"payment\",\"origin_context\":null,\"payment_intent\":\"pi_3TaaQvRuJkt9GwMN12XLlzJy\",\"payment_link\":null,\"payment_method_collection\":\"if_required\",\"payment_method_configuration_details\":null,\"payment_method_options\":{\"card\":{\"request_three_d_secure\":\"automatic\"}},\"payment_method_types\":[\"card\"],\"payment_status\":\"paid\",\"permissions\":null,\"phone_number_collection\":{\"enabled\":false},\"presentment_details\":{\"presentment_amount\":3781607,\"presentment_currency\":\"mga\"},\"recovered_from\":null,\"saved_payment_method_options\":null,\"setup_intent\":null,\"shipping_address_collection\":null,\"shipping_cost\":null,\"shipping_options\":[],\"status\":\"complete\",\"submit_type\":null,\"subscription\":null,\"success_url\":\"http://localhost:3000/commande/succes?commande_id=7\",\"total_details\":{\"amount_discount\":0,\"amount_shipping\":0,\"amount_tax\":0},\"ui_mode\":\"hosted_page\",\"url\":null,\"wallet_options\":null}','2026-05-24 11:45:42'),(4,8,600.00,'stripe','cs_test_a1xKAOLTl4cQiWBL0yDiOaSW99GWf7AraLDuIAU8pkQvXEXWOsCig9VVEh','reussi','{\"id\":\"cs_test_a1xKAOLTl4cQiWBL0yDiOaSW99GWf7AraLDuIAU8pkQvXEXWOsCig9VVEh\",\"object\":\"checkout.session\",\"adaptive_pricing\":{\"enabled\":true},\"after_expiration\":null,\"allow_promotion_codes\":null,\"amount_subtotal\":60000,\"amount_total\":60000,\"automatic_tax\":{\"enabled\":false,\"liability\":null,\"provider\":null,\"status\":null},\"billing_address_collection\":null,\"branding_settings\":{\"background_color\":\"#ffffff\",\"border_style\":\"rounded\",\"button_color\":\"#0074d4\",\"display_name\":\"environnement de test Web devellopeur Test\",\"font_family\":\"default\",\"icon\":null,\"logo\":null},\"cancel_url\":\"http://localhost:3000/panier\",\"client_reference_id\":null,\"client_secret\":null,\"collected_information\":null,\"consent\":null,\"consent_collection\":null,\"created\":1779626761,\"currency\":\"eur\",\"currency_conversion\":null,\"custom_fields\":[],\"custom_text\":{\"after_submit\":null,\"shipping_address\":null,\"submit\":null,\"terms_of_service_acceptance\":null},\"customer\":null,\"customer_account\":null,\"customer_creation\":\"if_required\",\"customer_details\":{\"address\":{\"city\":null,\"country\":\"MG\",\"line1\":null,\"line2\":null,\"postal_code\":null,\"state\":null},\"business_name\":null,\"email\":\"kingvonisation@gmail.com\",\"individual_name\":null,\"name\":\"king man\",\"phone\":null,\"tax_exempt\":\"none\",\"tax_ids\":[]},\"customer_email\":null,\"discounts\":[],\"expires_at\":1779713161,\"integration_identifier\":null,\"invoice\":null,\"invoice_creation\":{\"enabled\":false,\"invoice_data\":{\"account_tax_ids\":null,\"custom_fields\":null,\"description\":null,\"footer\":null,\"issuer\":null,\"metadata\":{},\"rendering_options\":null}},\"livemode\":false,\"locale\":null,\"managed_payments\":{\"enabled\":false},\"metadata\":{\"commande_id\":\"8\",\"user_id\":\"11\"},\"mode\":\"payment\",\"origin_context\":null,\"payment_intent\":\"pi_3TabQ0RuJkt9GwMN1Dq9Xf9U\",\"payment_link\":null,\"payment_method_collection\":\"if_required\",\"payment_method_configuration_details\":null,\"payment_method_options\":{\"card\":{\"request_three_d_secure\":\"automatic\"}},\"payment_method_types\":[\"card\"],\"payment_status\":\"paid\",\"permissions\":null,\"phone_number_collection\":{\"enabled\":false},\"presentment_details\":{\"presentment_amount\":3033374,\"presentment_currency\":\"mga\"},\"recovered_from\":null,\"saved_payment_method_options\":null,\"setup_intent\":null,\"shipping_address_collection\":null,\"shipping_cost\":null,\"shipping_options\":[],\"status\":\"complete\",\"submit_type\":null,\"subscription\":null,\"success_url\":\"http://localhost:3000/commande/succes?commande_id=8\",\"total_details\":{\"amount_discount\":0,\"amount_shipping\":0,\"amount_tax\":0},\"ui_mode\":\"hosted_page\",\"url\":null,\"wallet_options\":null}','2026-05-24 12:48:59'),(5,9,528.00,'stripe','cs_test_b1jlkQNSL8j9eSye8khyIA2T0gSf8BvOWNsJzQoLek6XRqTsCHMlWUespW','reussi','{\"id\":\"cs_test_b1jlkQNSL8j9eSye8khyIA2T0gSf8BvOWNsJzQoLek6XRqTsCHMlWUespW\",\"object\":\"checkout.session\",\"adaptive_pricing\":{\"enabled\":true},\"after_expiration\":null,\"allow_promotion_codes\":null,\"amount_subtotal\":52800,\"amount_total\":52800,\"automatic_tax\":{\"enabled\":false,\"liability\":null,\"provider\":null,\"status\":null},\"billing_address_collection\":null,\"branding_settings\":{\"background_color\":\"#ffffff\",\"border_style\":\"rounded\",\"button_color\":\"#0074d4\",\"display_name\":\"environnement de test Web devellopeur Test\",\"font_family\":\"default\",\"icon\":null,\"logo\":null},\"cancel_url\":\"http://localhost:3000/panier\",\"client_reference_id\":null,\"client_secret\":null,\"collected_information\":null,\"consent\":null,\"consent_collection\":null,\"created\":1780256728,\"currency\":\"eur\",\"currency_conversion\":null,\"custom_fields\":[],\"custom_text\":{\"after_submit\":null,\"shipping_address\":null,\"submit\":null,\"terms_of_service_acceptance\":null},\"customer\":null,\"customer_account\":null,\"customer_creation\":\"if_required\",\"customer_details\":{\"address\":{\"city\":null,\"country\":\"MG\",\"line1\":null,\"line2\":null,\"postal_code\":null,\"state\":null},\"business_name\":null,\"email\":\"kingvonisation@gmail.com\",\"individual_name\":null,\"name\":\"king man\",\"phone\":null,\"tax_exempt\":\"none\",\"tax_ids\":[]},\"customer_email\":null,\"discounts\":[],\"expires_at\":1780343128,\"integration_identifier\":null,\"invoice\":null,\"invoice_creation\":{\"enabled\":false,\"invoice_data\":{\"account_tax_ids\":null,\"custom_fields\":null,\"description\":null,\"footer\":null,\"issuer\":null,\"metadata\":{},\"rendering_options\":null}},\"livemode\":false,\"locale\":null,\"managed_payments\":{\"enabled\":false},\"metadata\":{\"commande_id\":\"9\",\"user_id\":\"13\"},\"mode\":\"payment\",\"origin_context\":null,\"payment_intent\":\"pi_3TdFIwRuJkt9GwMN18Ok9cYQ\",\"payment_link\":null,\"payment_method_collection\":\"if_required\",\"payment_method_configuration_details\":null,\"payment_method_options\":{\"card\":{\"request_three_d_secure\":\"automatic\"}},\"payment_method_types\":[\"card\"],\"payment_status\":\"paid\",\"permissions\":null,\"phone_number_collection\":{\"enabled\":false},\"presentment_details\":{\"presentment_amount\":2681207,\"presentment_currency\":\"mga\"},\"recovered_from\":null,\"saved_payment_method_options\":null,\"setup_intent\":null,\"shipping_address_collection\":null,\"shipping_cost\":null,\"shipping_options\":[],\"status\":\"complete\",\"submit_type\":null,\"subscription\":null,\"success_url\":\"http://localhost:3000/commande/succes?commande_id=9\",\"total_details\":{\"amount_discount\":0,\"amount_shipping\":0,\"amount_tax\":0},\"ui_mode\":\"hosted_page\",\"url\":null,\"wallet_options\":null}','2026-05-31 19:48:35');
/*!40000 ALTER TABLE `paiements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panier`
--

DROP TABLE IF EXISTS `panier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `panier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panier`
--

LOCK TABLES `panier` WRITE;
/*!40000 ALTER TABLE `panier` DISABLE KEYS */;
INSERT INTO `panier` VALUES (1,2,'2026-05-19 12:53:52','2026-05-19 12:53:52',NULL),(2,4,'2026-05-19 12:53:52','2026-05-19 12:53:52',NULL),(3,1,'2026-05-20 08:03:52','2026-05-20 08:03:52',NULL),(4,6,'2026-05-20 08:10:42','2026-05-20 08:10:42',NULL),(6,11,'2026-05-24 10:59:33','2026-05-24 10:59:33',NULL),(7,13,'2026-05-31 19:47:47','2026-05-31 19:47:47',NULL);
/*!40000 ALTER TABLE `panier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panier_items`
--

DROP TABLE IF EXISTS `panier_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `panier_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `panier_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) DEFAULT 1,
  `prix` decimal(10,2) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_panier_produit` (`panier_id`,`produit_id`),
  KEY `produit_id` (`produit_id`),
  KEY `idx_panier_items` (`panier_id`),
  CONSTRAINT `panier_items_ibfk_1` FOREIGN KEY (`panier_id`) REFERENCES `panier` (`id`) ON DELETE CASCADE,
  CONSTRAINT `panier_items_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panier_items`
--

LOCK TABLES `panier_items` WRITE;
/*!40000 ALTER TABLE `panier_items` DISABLE KEYS */;
INSERT INTO `panier_items` VALUES (3,2,5,2,350000.00,'2026-05-19 12:53:52');
/*!40000 ALTER TABLE `panier_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_code` (`code`),
  KEY `idx_expires` (`expires_at`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produit_images`
--

DROP TABLE IF EXISTS `produit_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produit_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `est_principale` tinyint(1) DEFAULT 0,
  `ordre` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_images_produit` (`produit_id`),
  CONSTRAINT `produit_images_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produit_images`
--

LOCK TABLES `produit_images` WRITE;
/*!40000 ALTER TABLE `produit_images` DISABLE KEYS */;
INSERT INTO `produit_images` VALUES (1,1,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779258887/guyagod/produits/rtcwwpp7rrup6jmultsi.jpg',1,0),(2,2,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779258938/guyagod/produits/fci6hrm7pzbxfytjjvc9.jpg',1,0),(3,3,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779259509/guyagod/produits/esvnblin3fmhj9ubbqep.jpg',1,0),(4,4,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779259546/guyagod/produits/ezetaisbeiq7yoxho6yw.jpg',1,0),(5,5,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779259592/guyagod/produits/ocaufmh6ub4mwnc4ojf5.jpg',1,0),(6,6,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779259640/guyagod/produits/td4ojd4idigkqqup2rw2.jpg',1,0),(7,7,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779259670/guyagod/produits/vv6gtpk6aywkkznkmcdk.jpg',1,0),(8,8,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779448464/guyagod/produits/vile5emmuioldnhremva.jpg',1,0),(9,9,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779448572/guyagod/produits/bk8vwpghejhfsndbep1f.jpg',1,0),(10,10,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779449174/guyagod/produits/vetsbr7dc5klnq4k73em.jpg',1,0),(11,11,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779449714/guyagod/produits/k5ovesqxd98gjdtfeqxe.jpg',1,0),(12,12,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522198/guyagod/produits/fckviele2bvhmk30s4pp.jpg',1,0),(13,12,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522198/guyagod/produits/esm7gpkesmgzfni4t6wg.jpg',0,1),(14,13,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522334/guyagod/produits/ervni6n5833f2s8scded.jpg',1,0),(15,13,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522334/guyagod/produits/keakpp2snz46vrnwbbl4.jpg',0,1),(16,13,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522334/guyagod/produits/k91xiss7copxg8u2jdhd.jpg',0,2),(17,13,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522334/guyagod/produits/tbonnkf4cx4stn5jqcfy.jpg',0,3),(18,14,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779522688/guyagod/produits/r1icp36kvbe5cspiqtym.jpg',1,0),(19,15,'https://res.cloudinary.com/dx4ee14gi/image/upload/v1779523597/guyagod/produits/f1slgev4r8ogra3gjdcn.jpg',1,0);
/*!40000 ALTER TABLE `produit_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produit_specifications`
--

DROP TABLE IF EXISTS `produit_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produit_specifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `cle` varchar(100) NOT NULL,
  `valeur` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_specs_produit` (`produit_id`),
  KEY `idx_specs_cle` (`cle`),
  CONSTRAINT `produit_specifications_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produit_specifications`
--

LOCK TABLES `produit_specifications` WRITE;
/*!40000 ALTER TABLE `produit_specifications` DISABLE KEYS */;
INSERT INTO `produit_specifications` VALUES (2,13,'Taille ','L - M - XL - XXL'),(3,12,'Taille','L - M - XL - XXL'),(5,14,'Capacité','20000mah');
/*!40000 ALTER TABLE `produit_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `sku` varchar(100) DEFAULT NULL,
  `etat` enum('neuf','occasion','reconditionne') DEFAULT 'neuf',
  `category_id` int(11) DEFAULT NULL,
  `marque_id` int(11) DEFAULT NULL,
  `vendeur_id` int(11) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `marque_id` (`marque_id`),
  KEY `idx_produits_category` (`category_id`),
  KEY `idx_produits_vendeur` (`vendeur_id`),
  KEY `idx_produits_actif` (`actif`),
  KEY `idx_produits_prix` (`prix`),
  KEY `idx_produits_etat` (`etat`),
  CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `produits_ibfk_2` FOREIGN KEY (`marque_id`) REFERENCES `marques` (`id`) ON DELETE SET NULL,
  CONSTRAINT `produits_ibfk_3` FOREIGN KEY (`vendeur_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produits`
--

LOCK TABLES `produits` WRITE;
/*!40000 ALTER TABLE `produits` DISABLE KEYS */;
INSERT INTO `produits` VALUES (1,'iPhone 15 Pro','iphone-15-pro-1','Smartphone Apple',699.00,8,'SKU-0056','neuf',2,1,3,1,'2026-05-19 12:53:52','2026-05-22 11:05:16'),(2,'Samsung S24','samsung-s24-2','Galaxy haut de gamme',399.00,15,'','neuf',2,2,3,1,'2026-05-19 12:53:52','2026-05-22 12:38:02'),(3,'HP Laptop 16','hp-laptop-16-3','Ordinateur portable HP',399.00,8,'sku-001','neuf',1,4,3,1,'2026-05-19 12:53:52','2026-05-20 06:48:23'),(4,'Dell Inspiron','dell-inspiron-4','PC bureautique',499.00,3,'SKU-002','neuf',1,5,3,1,'2026-05-19 12:53:52','2026-05-24 11:45:40'),(5,'Nike Air Max','nike-air-max-5','Chaussure sport',249.00,29,'SKU-003','neuf',5,6,3,1,'2026-05-19 12:53:52','2026-05-24 11:45:40'),(6,'Adidas Runner','adidas-runner-6','Chaussure running',148.98,25,'SKU-004','neuf',5,7,3,0,'2026-05-19 12:53:52','2026-05-22 11:05:40'),(7,'Xiaomi Redmi Note 13','xiaomi-redmi-note-13-7','Smartphone budget',248.99,40,'SKU-005','neuf',2,3,3,1,'2026-05-19 12:53:52','2026-05-20 06:51:03'),(8,'SAMSUNG S21','samsung-s21-8','Gamme samsung s21',299.00,15,'SKU-000008','neuf',2,2,1,1,'2026-05-22 11:17:16','2026-05-24 11:20:24'),(9,'Adidas Runner','adidas-runner-9','chaussure adidas',129.00,9,'SKU-000009','occasion',5,7,1,1,'2026-05-22 11:19:04','2026-05-31 19:48:34'),(10,'Dell Inspiron 2','dell-inspiron-2-10','Dernier gamme ispirion 2s',399.00,19,'SKU-000010','neuf',1,5,1,1,'2026-05-22 11:29:07','2026-05-31 19:48:34'),(11,'Dell Inspiron 3','dell-inspiron-3-11','dernier gammes ',459.00,50,'SKU-000011','neuf',1,5,3,1,'2026-05-22 11:38:07','2026-05-24 12:52:58'),(12,'T-shirt blanc','t-shirt-blanc-12','t-shirt blanc sans logo',20.00,10,'SKU-000012','neuf',8,NULL,1,1,'2026-05-23 07:46:11','2026-05-23 07:48:52'),(13,'T-shirt noir','t-shirt-noir-1779522507582','T-shirt noir sans logo',22.00,50,'SKU-000013','neuf',8,NULL,1,1,'2026-05-23 07:48:27','2026-05-23 07:48:27'),(14,'power bank ','power-bank--14','power bank  20000 mah peut charge votre smartphone rapidement.',30.00,27,'SKU-000014','neuf',9,NULL,1,1,'2026-05-23 07:54:21','2026-05-24 12:48:57'),(15,'Souris','souris-1779523771244','Souris sans fils gamer',25.00,14,'SKU-000015','neuf',10,NULL,1,1,'2026-05-23 08:09:31','2026-05-24 11:09:55');
/*!40000 ALTER TABLE `produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `pourcentage` decimal(5,2) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_promo_produit` (`produit_id`),
  KEY `idx_promo_dates` (`date_debut`,`date_fin`),
  CONSTRAINT `promotions_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,1,20.00,'2026-05-20 06:51:00','2026-05-31 23:59:00',1);
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom_role` (`nom_role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(3,'client'),(2,'vendeur');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_mouvements`
--

DROP TABLE IF EXISTS `stock_mouvements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_mouvements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `type_mouvement` enum('entree','sortie','ajustement') NOT NULL,
  `quantite` int(11) NOT NULL,
  `raison` varchar(255) DEFAULT NULL,
  `commande_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `idx_stock_produit` (`produit_id`),
  CONSTRAINT `stock_mouvements_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`),
  CONSTRAINT `stock_mouvements_ibfk_2` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_mouvements`
--

LOCK TABLES `stock_mouvements` WRITE;
/*!40000 ALTER TABLE `stock_mouvements` DISABLE KEYS */;
INSERT INTO `stock_mouvements` VALUES (1,1,'entree',10,'Stock initial',NULL,'2026-05-19 12:53:52'),(2,2,'entree',15,'Stock initial',NULL,'2026-05-19 12:53:52'),(3,5,'sortie',2,'Vente',NULL,'2026-05-19 12:53:52'),(4,1,'sortie',1,'vente',1,'2026-05-20 08:21:47'),(5,1,'sortie',1,'vente',2,'2026-05-20 08:27:11'),(6,14,'sortie',1,'vente',3,'2026-05-24 10:59:56'),(7,15,'sortie',1,'vente',3,'2026-05-24 10:59:56'),(8,15,'sortie',2,'vente',4,'2026-05-24 11:00:53'),(9,15,'sortie',3,'vente',5,'2026-05-24 11:09:55'),(10,4,'sortie',1,'vente',6,'2026-05-24 11:20:24'),(11,8,'sortie',1,'vente',6,'2026-05-24 11:20:24'),(12,4,'sortie',1,'vente',7,'2026-05-24 11:45:40'),(13,5,'sortie',1,'vente',7,'2026-05-24 11:45:40'),(14,14,'sortie',20,'vente',8,'2026-05-24 12:48:57'),(15,9,'sortie',1,'vente',9,'2026-05-31 19:48:34'),(16,10,'sortie',1,'vente',9,'2026-05-31 19:48:34');
/*!40000 ALTER TABLE `stock_mouvements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `photo_profil` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 3,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_actif` (`actif`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','System','admin@bazarguyane.com','0000000000','$2b$12$jjepvCcpYSd2EAcpxcMYgur5p8E0mIINsrvi72FlQB/9szGEghCqa','https://res.cloudinary.com/dx4ee14gi/image/upload/v1779264011/guyagod/profils/zgpwat4ikhuoe5vncz56.png',1,1,'2026-05-19 12:52:53','2026-05-22 18:14:18',0,NULL),(2,'admin','Support','adminsupport@bazarguyane.com','0320000000','$2b$12$jjepvCcpYSd2EAcpxcMYgur5p8E0mIINsrvi72FlQB/9szGEghCqa',NULL,1,1,'2026-05-19 12:52:53','2026-05-22 18:16:10',0,NULL),(3,'Marie','Rabe','marie@gmail.com','0330000000','$2b$12$jjepvCcpYSd2EAcpxcMYgur5p8E0mIINsrvi72FlQB/9szGEghCqa',NULL,2,1,'2026-05-19 12:52:53','2026-05-19 12:52:53',0,NULL),(4,'Koto','Rakoto','koto@gmail.com','0340000000','$2b$12$jjepvCcpYSd2EAcpxcMYgur5p8E0mIINsrvi72FlQB/9szGEghCqa',NULL,3,1,'2026-05-19 12:52:53','2026-05-19 12:52:53',0,NULL),(6,'King','Von','kingvonisation@gmail.com','0329988845','$2b$12$nwE2owZoTMV8zs/ROTVDeuAQHwU7cQblsWXEHHe7s.oKm.FhV/yVG','https://res.cloudinary.com/dx4ee14gi/image/upload/v1779265916/guyagod/profils/iqfyxaw0hzif7puihlne.png',3,1,'2026-05-19 13:16:31','2026-05-22 10:21:03',0,NULL),(10,'SATORU','Gojo','satorugojo3582@gmail.com','+522 556666555','$2b$12$gP5PGc2n/KRyRLO9tOsehOaEm1qKQ4KkBaDp2EXBvc64RlmybeO2a',NULL,3,1,'2026-05-22 18:07:50','2026-05-22 18:07:50',0,NULL),(11,'RAZAKANIRINA','Jubrio','jubriorazaka09@gmail.com','+261328838098','$2b$12$Fg5/leesH2BqxguK2Fz9ZeLtruaQMcZPtM.p4i2BCR.pjFSCn3T1e','https://res.cloudinary.com/dx4ee14gi/image/upload/v1779521535/guyagod/profils/ew9uswacey9jhmaf71aa.jpg',3,1,'2026-05-23 07:33:31','2026-05-23 07:35:12',0,NULL),(12,'test','testeue','testeur@bazarguyane.com','0328835028','$2b$12$kK2Ue15aIxisCxAoPFm8meRDWXKMtSSUpeh4.9gthtf.W/qVyGBXC',NULL,2,1,'2026-05-25 12:59:13','2026-05-25 12:59:13',0,NULL),(13,'mamalina','tr','mamalina20p@gmail.com','+261328838098','$2b$12$Qq0dZo7Abzzp9ySriKeU0uqYrUyLICvSVCLZzAGOigZi5iR0edIJa',NULL,3,1,'2026-05-31 19:34:43','2026-05-31 19:34:43',0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 23:21:58
