CREATE DATABASE IF NOT EXISTS `sicvm_pizza`;
USE `sicvm_pizza`;
# -----  <TABLE: USUARIOS>  ------
CREATE TABLE IF NOT EXISTS `sicvm_pizza`.`0_Usrs` (
    `Rfrnc` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Rfrnc (Referencia)',
    `NmbrUsr` VARCHAR(20) NOT NULL COMMENT 'NmbrUsr (Nombre de Usuario)',
    `Cntrsn` VARCHAR(255) NOT NULL COMMENT 'Cntrsn (Contraseña)',
    `Rfrnc_TpUsr` INT(11) NOT NULL COMMENT 'Rfrnc_TpUsr (Referencia: Tipo de Usuario)',
    PRIMARY KEY(`Rfrnc`)
) ENGINE='MyISAM' DEFAULT CHARSET='utf8' COLLATE='utf8_bin' COMMENT='0_Usrs (0 - Usuarios)';
DESCRIBE `sicvm_pizza`.`0_Usrs`;

# -----  <TABLE: TIPO DE USUARIOS>  ------
CREATE TABLE IF NOT EXISTS `sicvm_pizza`.`0_TpUsrs` (
    `Rfrnc` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Rfrnc (Referencia)',
    `NmbrTpUsr` VARCHAR(20) NOT NULL COMMENT 'Nmbr_TpUsr (Nombre: Tipo de Usuario)',    
    `Estd` INT(2) NOT NULL COMMENT 'Estd (Estado [0 - Inactivo, 1 - Activo, 2 - Bloqueado])',
    PRIMARY KEY(`Rfrnc`)
) ENGINE='MyISAM' DEFAULT CHARSET='utf8' COLLATE='utf8_bin' COMMENT='0_TpUsrs (0 - Tipo de Usuarios)';
DESCRIBE `sicvm_pizza`.`0_TpUsrs`;

# -----  <TABLE: COMIDAS>  ------
CREATE TABLE IF NOT EXISTS `sicvm_pizza`.`0_Cmds` (
    `Rfrnc` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Rfrnc (Referencia)',    
    `Rfrnc_Usr` INT(11) NOT NULL COMMENT 'Rfrnc_Usr (Referencia: Usuario)',
    `Imgn` VARCHAR(50) NOT NULL COMMENT 'Imgn (Imágen)'
    `NmbrCmd` VARCHAR(25) NOT NULL COMMENT 'RfrncUsr (Referencia: Usuario)',
    `Dtlss` TEXT NOT NULL COMMENT 'Detlls (Detalles)',
    `Prc_Dlrs` INT(11) COMMENT 'Prc_Dlrs (Precio: Dolares)',
    `Prc_Ers` INT(11) COMMENT 'Prc_Ers (Precio: Euros)',
    `Estd` INT(2) NOT NULL COMMENT 'Estd (Estado)'
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`Rfrnc`),
    CONSTRAINT `fk_user` FOREIGN KEY (`Rfrnc_Usr`) REFERENCES `sicvm_pizza`.`0_Usrs`(`Rfrnc`)
) ENGINE='MyISAM' DEFAULT CHARSET='utf8' COLLATE='utf8_bin' COMMENT='0_Cmds (0 - Comidas)';

# -------------- <INSERT PIZZA DEFAULT> -------------------

INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-marinara.jpg','La marinara', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-margherita.jpg','La margherita', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-sfincione.jpg','La sfincione', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-fugazza.jpg','La fugazza', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-fugazza-con-queso.jpg','La fugazza con queso', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/la-fugazzeta.jpg','La fugazzeta', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/chicago-pizza-style.jpg','Chicago Pizza Style', '', 25, 30, 1, CURRENT_TIMESTAMP); 
INSERT INTO `sicvm_pizza`.`0_Cmds` VALUES (null, 1, '/img/cmds/pizza/new-york-pizza-style.jpg','New York Pizza Style', '', 25, 30, 1, CURRENT_TIMESTAMP); 

# -----  <TABLE: PEDIDO>  ------
CREATE TABLE IF NOT EXISTS `sicvm_pizza`.`0_Pdds` (
    `Rfrnc` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Rfrnc (Referencia)',
    `Rfrnc_Usr` INT(11) NOT NULL COMMENT 'Rfrnc_Usr (Referencia: Usuario)',
    `Rfrnc_Cmd` INT(11) NOT NULL COMMENT 'Rfrnc_Cmd (Referencia: Comida)',
    `Cntdd` INT(11) COMMENT 'Prc_Dlrs (Precio: Dolares)',
    `Dtlls` INT(11) COMMENT 'Prc_Ers (Precio: Euros)',
    `Total_Dolares` VARCHAR(25) NOT NULL,
    `Total_Euro ` VARCHAR(25) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`Rfrnc`)
) ENGINE='MyISAM' DEFAULT CHARSET='utf8' COLLATE='utf8_bin' COMMENT='0_Pdds (0 - Pedidos)';