CREATE TABLE `Users` (
  `user_id` integer PRIMARY KEY,
  `username` string,
  `passsword` string,
  `email` string,
  `created_at` timestamp
);

CREATE TABLE `Products` (
  `product_id` integer PRIMARY KEY,
  `name` string,
  `description` string,
  `price` integer,
  `image` string,
  `stock` integer
);

CREATE TABLE `Carts` (
  `cart_id` integer PRIMARY KEY,
  `user_id` integer
);

CREATE TABLE `CartItems` (
  `cart_item_id` integer PRIMARY KEY,
  `cart_id` integer,
  `product_id` integer,
  `quantity` integer
);

CREATE TABLE `Orders` (
  `order_id` integer PRIMARY KEY,
  `user_id` integer,
  `created_at` timestamp
);

CREATE TABLE `OrderItems` (
  `order_item_id` integer PRIMARY KEY,
  `order_id` integer,
  `product_id` integer,
  `quantity` integer,
  `price` integer
);

ALTER TABLE `Users` ADD FOREIGN KEY (`user_id`) REFERENCES `Carts` (`user_id`);

ALTER TABLE `CartItems` ADD FOREIGN KEY (`cart_id`) REFERENCES `Carts` (`cart_id`);

ALTER TABLE `CartItems` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`);

ALTER TABLE `Orders` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `OrderItems` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`);

ALTER TABLE `Products` ADD FOREIGN KEY (`product_id`) REFERENCES `OrderItems` (`product_id`);
