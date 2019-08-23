CREATE TABLE images (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    image_name TEXT,
    image TEXT,
    date_created TIMESTAMP DEFAULT NOW() NOT NULL,
    user_id INTEGER REFERENCES udown_users(id) NOT NULL
)