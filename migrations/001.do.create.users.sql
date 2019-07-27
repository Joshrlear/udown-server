CREATE TABLE udown_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    date_created TIMESTAMP DEFAULT NOW() NOT NULL
);