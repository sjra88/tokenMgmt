This is for internal token management..


web3.js(v0.20.6) is not reliable for me.. 
It will be upgrade to v1.x.

Manaing Address should be added in DB.(to be developed)

This is db schema.

CREATE TABLE `tokenholder` (
  `disp_order` int(10) unsigned DEFAULT 99,
  `Network` int(10) unsigned NOT NULL,
  `HolderName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Phone-Prefix` varchar(50) DEFAULT NULL,
  `Phone-Number` varchar(50) DEFAULT NULL,
  `SECRET_Init` decimal(20,5) DEFAULT NULL,
  `Address` varchar(50) NOT NULL,
  `Privatekey` varchar(80) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `KeyStore_name` varchar(100) DEFAULT NULL,
  `KeyStore_content` text DEFAULT NULL,
  `RegDate` datetime DEFAULT NULL,
  `etc` text DEFAULT NULL,
  PRIMARY KEY (`Address`,`Network`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4


