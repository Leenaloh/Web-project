INSERT INTO creditcards (id, firstName, lastName, expiration)
VALUES ('cc100', 'Muntaha', 'Alnasser', '2030-12-31')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (firstName, lastName, ccId, address, email, password)
VALUES ('Muntaha', 'Alnasser', 'cc100', 'Riyadh', 'm@example.com', '1234');

INSERT INTO cart_items (customer_id, movie_id)
SELECT c.id, m.id
FROM (SELECT id FROM customers ORDER BY id DESC LIMIT 1) c
CROSS JOIN (SELECT id FROM movies LIMIT 2) m
ON CONFLICT (customer_id, movie_id) DO NOTHING;