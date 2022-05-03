#Create user table

CREATE TABLE users ("id" serial primary key, username text, password text, fullname text, prefer text, email varchar,streetaddress varchar, postcode int,city varchar, phone int, role text);

INSERT INTO users (username,password,fullname,prefer,email,streetaddress,postcode,city,phone,role) VALUES('admin','$2a$10$tXMKF036p0ZYIxF/cJEHauw/TFrcho4DXy41Kt12D3Lbnzr221hmK','Admin','I-AM-Admin','client@test.com','street-1-address',12345,'delhi',098767,'admin');

#create product table

CREATE TABLE products(
   product_id INT GENERATED ALWAYS AS IDENTITY,
   user_id INT,
   product_name VARCHAR(100) NOT NULL,
   product_des VARCHAR(250),
   ammount INT,
   PRIMARY KEY(product_id),
   CONSTRAINT fk_users
      FOREIGN KEY(user_id) 
	  REFERENCES users(id)
);


insert into products (user_id, product_name, product_des, ammount)values(1, 'Augmentin 625 Duo Tablet','Treatment of Bacterial infections', 200);
insert into products (user_id, product_name, product_des, ammount)values(1, 'Ascoril LS Syrup','Treatment of Cough with mucus', 110);
insert into products (user_id, product_name, product_des, ammount)values(2, 'Aciloc 150 Tablet','Treatment of Peptic ulcer disease', 50);
insert into products (user_id, product_name, product_des, ammount)values(2, 'Ursocol 300 Tablet','Treatment of Gallbladder stones', 150);


#create orders table
CREATE TABLE orders(
  order_id INT GENERATED ALWAYS AS IDENTITY,
  product_id INT REFERENCES products (product_id),
  user_id INT REFERENCES users (id),
  qty INT,
  price INT,
  total INT,
  status BOOLEAN);

  INSERT INTO orders (product_id,user_id,qty,price,total,status) VALUES (16,1,2,20,40,TRUE);


-- We have tableA and tableB, x is primary key in tableA and also
-- a foreign key in tableB as y
SELECT * FROM tableA JOIN tableB ON tableA.x = tableB.y;

select product_name, product_des, ammount from products JOIN orders ON products.product_id = orders.product_id;

select t1.product_name, 
       t1.product_des,
       t1.ammount,
       t2.username,t3.qty from products t1
INNER JOIN orders t3 ON t1.product_id = t3.product_id
INNER JOIN users t2 ON t3.user_id = t2.id;