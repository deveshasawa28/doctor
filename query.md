#Create user table

CREATE TABLE users ("id" serial primary key, username text, password text, fullname text, prefer text, email varchar,streetaddress varchar, postcode int,city varchar, phone int, role text);

INSERT INTO users (username,password,fullname,prefer,email,streetaddress,postcode,city,phone,role) VALUES('client','$2a$10$tXMKF036p0ZYIxF/cJEHauw/TFrcho4DXy41Kt12D3Lbnzr221hmK','client Name','IAMCLIENT','client@test.com','street-1-address',12345,'delhi',098767,'admin');

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


insert into products (user_id, product_name, product_des, ammount)values(1, 'madicin3','Pain', 1);


#create orders table
CREATE TABLE orders(
  order_id INT GENERATED ALWAYS AS IDENTITY,
  product_id INT,
  user_id INT,
  qty INT,
  price INT,
  total INT,
  status BOOLEAN);

  INSERT INTO orders (product_id,user_id,qty,price,total,status) VALUES (1,1,2,20,40,TRUE);
