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
  id       VARCHAR(10) PRIMARY KEY,
  title    VARCHAR(100) NOT NULL,
  year     INTEGER NOT NULL,
  director VARCHAR(100) NOT NULL
);

CREATE TABLE stars (
  id        VARCHAR(10) PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  birthYear INTEGER
);

CREATE TABLE stars_in_movies (
  starId  VARCHAR(10) NOT NULL,
  movieId VARCHAR(10) NOT NULL,
  PRIMARY KEY (starId, movieId),
  FOREIGN KEY (starId) REFERENCES stars(id),
  FOREIGN KEY (movieId) REFERENCES movies(id)
);

CREATE TABLE genres (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(32) NOT NULL
);

CREATE TABLE genres_in_movies (
  genreId INTEGER NOT NULL,
  movieId VARCHAR(10) NOT NULL,
  PRIMARY KEY (genreId, movieId),
  FOREIGN KEY (genreId) REFERENCES genres(id),
  FOREIGN KEY (movieId) REFERENCES movies(id)
);

CREATE TABLE creditcards (
  id         VARCHAR(20) PRIMARY KEY,
  firstName  VARCHAR(50) NOT NULL,
  lastName   VARCHAR(50) NOT NULL,
  expiration DATE NOT NULL
);

CREATE TABLE customers (
  id        SERIAL PRIMARY KEY,
  firstName VARCHAR(50)  NOT NULL,
  lastName  VARCHAR(50)  NOT NULL,
  ccId      VARCHAR(20)  NOT NULL,
  address   VARCHAR(200) NOT NULL,
  email     VARCHAR(50)  NOT NULL,
  password  VARCHAR(20)  NOT NULL,
  FOREIGN KEY (ccId) REFERENCES creditcards(id)
);

CREATE TABLE sales (
  id         SERIAL PRIMARY KEY,
  customerId INTEGER     NOT NULL,
  movieId    VARCHAR(10) NOT NULL,
  saleDate   DATE        NOT NULL,
  FOREIGN KEY (customerId) REFERENCES customers(id),
  FOREIGN KEY (movieId) REFERENCES movies(id)
);

CREATE TABLE ratings (
  movieId  VARCHAR(10) PRIMARY KEY,
  rating   FLOAT   NOT NULL,
  numVotes INTEGER NOT NULL,
  FOREIGN KEY (movieId) REFERENCES movies(id)
);
