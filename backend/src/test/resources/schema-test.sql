DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS creditcards;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS genres_in_movies;
DROP TABLE IF EXISTS stars_in_movies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS stars;
DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id VARCHAR(10) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  director VARCHAR(100) NOT NULL
);

CREATE TABLE stars (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birthyear INTEGER
);

CREATE TABLE stars_in_movies (
  starid VARCHAR(10) NOT NULL,
  movieid VARCHAR(10) NOT NULL,
  PRIMARY KEY (starid, movieid),
  FOREIGN KEY (starid) REFERENCES stars(id),
  FOREIGN KEY (movieid) REFERENCES movies(id)
);

CREATE TABLE genres (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) NOT NULL
);

CREATE TABLE genres_in_movies (
  genreid INTEGER NOT NULL,
  movieid VARCHAR(10) NOT NULL,
  PRIMARY KEY (genreid, movieid),
  FOREIGN KEY (genreid) REFERENCES genres(id),
  FOREIGN KEY (movieid) REFERENCES movies(id)
);

CREATE TABLE creditcards (
  id VARCHAR(20) PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  expiration DATE NOT NULL
);

CREATE TABLE customers (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  ccid VARCHAR(20) NOT NULL,
  address VARCHAR(200) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(20) NOT NULL,
  FOREIGN KEY (ccid) REFERENCES creditcards(id)
);

CREATE TABLE sales (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  customerid INTEGER NOT NULL,
  movieid VARCHAR(10) NOT NULL,
  saledate DATE NOT NULL,
  FOREIGN KEY (customerid) REFERENCES customers(id),
  FOREIGN KEY (movieid) REFERENCES movies(id)
);

CREATE TABLE ratings (
  movieid VARCHAR(10) PRIMARY KEY,
  rating FLOAT NOT NULL,
  numvotes INTEGER NOT NULL,
  FOREIGN KEY (movieid) REFERENCES movies(id)
);

CREATE TABLE cart_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  movie_id VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  CONSTRAINT uq_cart_customer_movie UNIQUE (customer_id, movie_id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);
