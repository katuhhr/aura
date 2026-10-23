-- Структура базы данных. ВНИМАНИЕ: пересоздаёт таблицы, все данные удаляются.

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(50)  NOT NULL,                    -- Women, Men, Footwear, Accessories
    price       INTEGER      NOT NULL CHECK (price >= 0), -- в рублях
    description TEXT         NOT NULL DEFAULT '',
    sizes       TEXT[]       NOT NULL DEFAULT '{}',       -- например {S,M,L}
    colors      JSONB        NOT NULL DEFAULT '[]',       -- [{"name": "Чёрный", "hex": "#1f1a1a"}]
    images      TEXT[]       NOT NULL DEFAULT '{}'        -- ссылки на фото
);
