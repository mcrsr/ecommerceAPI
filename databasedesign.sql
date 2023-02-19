CREATE TABLE products(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  category INTEGER NOT NULL,
  image TEXT,
  FOREIGN KEY(category) REFERENCES categories(id)
  );
  
CREATE TABLE categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    category TEXT NOT NULL
    );
    
CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname TEXT NOT NULL,
    phone TEXT NOT NULL,
    address INTEGER NOT NULL,
    FOREIGN KEY(address) REFERENCES address(id)
    );
  
CREATE TABLE address(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipcode TEXT NOT NULL
    );
    
CREATE TABLE carts(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  userId INTEGER NOT NULL,
  date TEXT DEFAULT CURRENT_TIMESTAMP,
  orderID INTEGER NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id),
  FOREIGN KEY(orderID) REFERENCES ordered_products(id)
  );
 
CREATE TABLE ordered_products(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   product INTEGER NOT NULL,
   quantity INTEGER NOT NULL,
   FOREIGN KEY(product) REFERENCES products(id)
   );

CREATE TABLE stock(
  product INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(product) REFERENCES products(id)
  );
  

INSERT INTO categories(category) VALUES('electronics');
INSERT INTO categories(category) VALUES('jewelery');
INSERT INTO categories(category) VALUES('mens clothing');
INSERT INTO categories(category) VALUES('womens clothing');

INSERT INTO products(title,price,description,category,image) VALUES('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',109.95,'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',3,'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('Mens Casual Premium Slim Fit T-Shirts ',22.3,'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',3,'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('Mens Cotton Jacket',55.99,'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',3,'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('Mens Casual Slim Fit',15.99,'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.',3,'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('John Hardy Womens Legends Naga Gold & Silver Dragon Station Chain Bracelet',695,'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the oceans pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.',2,'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('Solid Gold Petite Micropave ',168,'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.',2,'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('White Gold Plated Princess',9.99,'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentines Day...',2,'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('Pierced Owl Rose Gold Plated Stainless Steel Double',10.99,'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel',2,'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('WD 2TB Elements Portable External Hard Drive - USB 3.0 ',64,'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',1,'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg');
INSERT INTO products(title,price,description,category,image) VALUES('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',109,'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)',1,'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg');

INSERT INTO address(address_line_1,address_line_2,city,state,zipcode) VALUES('address_line_1','address_line_2','Hyderabad','Telangana','500038');
INSERT INTO address(address_line_1,address_line_2,city,state,zipcode) VALUES('address_line_1','address_line_2','Kurnool','Andhra Pradesh','518598');

INSERT INTO users(email,username,password,fullname,phone,address) VALUES('ranga@email.com','ranga','ranga123','ranga swami','9632014587',1);
INSERT INTO users(email,username,password,fullname,phone,address) VALUES('swami@email.com','swami','swami123','swami reddy','9632014598',2);

INSERT INTO ordered_products(product,quantity) VALUES(1,5);
INSERT INTO ordered_products(product,quantity) VALUES(2,3);
INSERT INTO ordered_products(product,quantity) VALUES(3,6);

INSERT INTO carts(userId,orderID) VALUES(1,2);
INSERT INTO carts(userId,orderID) VALUES(1,3);
INSERT INTO carts(userId,orderID) VALUES(2,1);

 INSERT INTO stock VALUES(1,25);
 INSERT INTO stock VALUES(2,20);
 INSERT INTO stock VALUES(3,9);
 INSERT INTO stock VALUES(4,10);
 INSERT INTO stock VALUES(5,15);
 INSERT INTO stock VALUES(6,25);
 INSERT INTO stock VALUES(7,50);
 INSERT INTO stock VALUES(8,25);
 INSERT INTO stock VALUES(9,30);
 INSERT INTO stock VALUES(10,15);
