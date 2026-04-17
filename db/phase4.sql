ALTER TABLE movies
ADD COLUMN IF NOT EXISTS rental_price NUMERIC(10,2) NOT NULL DEFAULT 9.99;

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    movie_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT uq_cart_customer_movie UNIQUE (customer_id, movie_id)
);