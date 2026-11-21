INSERT INTO
    checkouts (id, number, open, people, products, updated_at)
VALUES
    (1, 1, true, 2, 40, CURRENT_TIMESTAMP),
    (2, 2, true, 3, 15, CURRENT_TIMESTAMP),
    (3, 3, true, 1, 30, CURRENT_TIMESTAMP),
    (4, 4, false, 0, 0, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING;