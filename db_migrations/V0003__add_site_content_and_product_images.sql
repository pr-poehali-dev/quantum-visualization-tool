CREATE TABLE IF NOT EXISTS site_content (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_content (key, value) VALUES
('hero_title', 'Русский Стол'),
('hero_subtitle', 'Натуральная древесина + современные технологии — ваш идеальный стол'),
('philosophy_title', 'Мебель с душой дуба'),
('philosophy_description', 'Умный и компьютерный стол из дуба — это больше, чем мебель. Это место, где семья собирается каждый день. Мы делаем столы из массива дуба, которые становятся центром вашего дома на десятилетия.'),
('cta_title', 'Ваш стол из дуба — на века'),
('cta_description', 'Расскажите нам о своём пространстве — мы подберём размер, форму и покрытие. Каждый стол делается под конкретный дом.')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
