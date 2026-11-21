CREATE TABLE
    IF NOT EXISTS checkouts (
        id BIGINT PRIMARY KEY,
        number INTEGER NOT NULL UNIQUE,
        open BOOLEAN NOT NULL,
        people INTEGER NOT NULL CHECK (people BETWEEN 0 AND 1000),
        products INTEGER NOT NULL CHECK (products BETWEEN 0 AND 100000),
        updated_at TIMESTAMP
        WITH
            TIME ZONE NOT NULL,
            CHECK (
                people > 0
                OR products = 0
            )
    );