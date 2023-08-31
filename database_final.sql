CREATE TABLE `Users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `password` VARCHAR(255),
  `email` VARCHAR(255),
  `cart` JSON,
  `user_order` JSON
);
