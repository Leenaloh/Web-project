-- Insert test data
INSERT INTO creditcards (id, firstname, lastname, expiration) VALUES
  ('6436-5723-2353-2522', 'Matt', 'Groening', '2043-11-24'),
  ('490003', 'Keith', 'Black', '2043-06-25');

INSERT INTO customers (id, firstname, lastname, ccid, address, email, password) VALUES
  (907015, 'Test', 'User', '6436-5723-2353-2522', '123 Test St', 'test@ksu.edu.sa', '1234'),
  (490003, 'Keith', 'White', '490003', '532 Yale Ave., Irvine, CA 92617', 'kwhite@ics185.edu', 'book');

INSERT INTO genres (id, name) VALUES
  (1, 'Action'),
  (2, 'Comedy'),
  (3, 'Drama'),
  (4, 'Thriller'),
  (5, 'Adventure'),
  (6, 'Science Fiction');

INSERT INTO movies (id, title, year, director) VALUES
  ('tt0264464', 'Catch Me If You Can', 2002, 'Steven Spielberg'),
  ('tt0421974', 'Sky Fighters', 2005, 'Gerard Pires'),
  ('tt0378947', 'Melinda and Melinda', 2004, 'Woody Allen'),
  ('tt0278823', 'Hollywood Ending', 2002, 'Woody Allen'),
  ('tt0313792', 'Anything Else', 2003, 'Woody Allen'),
  ('tt0416320', 'Match Point', 2005, 'Woody Allen'),
  ('tt0344854', 'Arthur and the Invisibles', 2006, 'Luc Besson'),
  ('tt0480269', 'Interview', 2007, 'Steve Buscemi'),
  ('tt0417415', 'Aliens of the Deep', 2005, 'James Cameron'),
  ('tt0228333', 'Ghosts of Mars', 2001, 'John Carpenter'),
  ('tt0257516', 'Cursed', 2005, 'Wes Craven'),
  ('tt0498380', 'Letters from Iwo Jima', 2006, 'Clint Eastwood'),
  ('tt0327056', 'Mystic River', 2003, 'Clint Eastwood'),
  ('tt0335345', 'The Passion of the Christ', 2004, 'Mel Gibson'),
  ('tt0496319', 'The Hottest State', 2006, 'Ethan Hawke'),
  ('tt0352248', 'Cinderella Man', 2005, 'Ron Howard'),
  ('tt0455805', 'Then She Found Me', 2007, 'Helen Hunt'),
  ('tt0166924', 'Mulholland Dr.', 2001, 'David Lynch'),
  ('tt0264616', 'Frailty', 2001, 'Bill Paxton'),
  ('tt0338751', 'The Aviator', 2004, 'Martin Scorsese'),
  ('tt0364189', '...Addio del passato...', 2002, 'Marco Bellocchio'),
  ('tt0247745', 'Superstar: The Karen Carpenter Story', 1987, 'Todd Haynes');

INSERT INTO stars (id, name, birthyear) VALUES
  ('nm0000194', 'Leonardo DiCaprio', 1974),
  ('nm0000228', 'Tom Hanks', 1956),
  ('nm0000210', 'Steven Spielberg', NULL),
  ('nm0000115', 'Steven Soderbergh', 1963),
  ('nm0817431', '.38 Special', NULL);

INSERT INTO stars_in_movies (starid, movieid) VALUES
  ('nm0000194', 'tt0264464'),
  ('nm0000228', 'tt0264464'),
  ('nm0000194', 'tt0338751'),
  ('nm0817431', 'tt0247745');

INSERT INTO genres_in_movies (genreid, movieid) VALUES
  (1, 'tt0264464'),
  (3, 'tt0264464'),
  (1, 'tt0421974'),
  (4, 'tt0421974'),
  (3, 'tt0364189');

INSERT INTO ratings (movieid, rating, numvotes) VALUES
  ('tt0264464', 8.5, 500000),
  ('tt0421974', 7.2, 150000),
  ('tt0378947', 7.0, 100000),
  ('tt0338751', 8.6, 800000),
  ('tt0364189', 7.1, 8);
