-- Структура базы данных. ВНИМАНИЕ: пересоздаёт таблицы, все данные удаляются.

DROP TABLE IF EXISTS cart_items;
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

-- Корзина: одна строка — один товар определённого размера и цвета у пользователя
CREATE TABLE cart_items (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    product_id INTEGER     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    size       VARCHAR(20) NOT NULL DEFAULT '',            -- '' — у товара нет размеров
    color      VARCHAR(50) NOT NULL DEFAULT '',
    quantity   INTEGER     NOT NULL CHECK (quantity > 0),
    UNIQUE (user_id, product_id, size, color)              -- одинаковые позиции не дублируются
);
