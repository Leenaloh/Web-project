CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    movie_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),

    CONSTRAINT unique_cart_customer_movie UNIQUE (customer_id, movie_id)
);
