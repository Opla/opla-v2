ALTER TABLE `intents` ADD COLUMN `order` INTEGER(11);

-- add default values for each intent
SET @position:=0;
UPDATE `intents` SET `order` = @position := @position + 1;
