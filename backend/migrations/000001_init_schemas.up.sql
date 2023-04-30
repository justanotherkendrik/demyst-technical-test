CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    display_name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR NOT NULL,
    year_established INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS balances (
    id SERIAL PRIMARY KEY,
    business INTEGER NOT NULL,
    profit_or_loss NUMERIC DEFAULT 0.00,
    assets_value NUMERIC DEFAULT 0.00,
    recorded_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounting_providers (
    id SERIAL PRIMARY KEY,
    provider_name VARCHAR NOT NULL UNIQUE
);