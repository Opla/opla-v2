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
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `applications` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `secret` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `redirect_uri` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `grant_type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `domains` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `policies` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `authentications` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `client_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `redirect_uri` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `scope` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `authentications` WRITE;
/*!40000 ALTER TABLE `authentications` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `botMiddlewares` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `botId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `middlewareId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extras` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `classes` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `origin` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `botMiddlewares` WRITE;
/*!40000 ALTER TABLE `botMiddlewares` DISABLE KEYS */;
/*!40000 ALTER TABLE `botMiddlewares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `botUsers` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `botId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `botUsers` WRITE;
/*!40000 ALTER TABLE `botUsers` DISABLE KEYS */;
/*!40000 ALTER TABLE `botUsers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `bots` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime(3) DEFAULT NULL,
  `language` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `welcome` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `publishedVersionId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `bots` WRITE;
/*!40000 ALTER TABLE `bots` DISABLE KEYS */;
/*!40000 ALTER TABLE `bots` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `participants` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_time` datetime(3) DEFAULT NULL,
  `last` datetime(3) DEFAULT NULL,
  `origin` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `intents` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `botId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `versionId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `previousId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `input` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `entities` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `output` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tags` text COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `intents` WRITE;
/*!40000 ALTER TABLE `intents` DISABLE KEYS */;
/*!40000 ALTER TABLE `intents` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `from` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `conversationId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_time` datetime(3) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `relayed` tinyint(1) DEFAULT NULL,
  `attachments` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `extras` text COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `middlewares` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `clientDirectory` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serverDirectory` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `classes` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `origin` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extras` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `middlewares` WRITE;
/*!40000 ALTER TABLE `middlewares` DISABLE KEYS */;
/*!40000 ALTER TABLE `middlewares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `parameters` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `value` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `parameters` WRITE;
/*!40000 ALTER TABLE `parameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameters` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime(3) DEFAULT NULL,
  `avatar` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `locale` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timezone` int(11) DEFAULT NULL,
  `gender` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `provider` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `access_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expires_in` int(11) DEFAULT NULL,
  `scope` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `client_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime(3) DEFAULT NULL,
  `last` datetime(3) DEFAULT NULL,
  `ua` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lg` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ga` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cfduid` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `users` (
  `id` binary(16) NOT NULL,
  `id_text` varchar(36) GENERATED ALWAYS AS (hex(`id`)) VIRTUAL,
  `idx` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `valid_email` tinyint(1) DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime(3) DEFAULT NULL,
  `anonymous` tinyint(1) DEFAULT NULL,
  `anonymous_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `anonymous_secret` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

