INSERT INTO products (name, category, description, price, image_url) VALUES
('Стол «Боярин»', 'Умный стол с подъёмным механизмом', 'Дуб сращенный, цвет Тик, Лак, размер 140×80×3 см', 50000, 'https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/1e9ce664-0469-4b9c-8b63-08b74d90c803.jpeg'),
('Стол «Купец»', 'Умный стол с подъёмным механизмом', 'Дуб сращенный, бесцветный, Лак, размер 130×70×3 см', 45000, 'https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/b9317af5-aca6-40f6-8ed8-c6b99fdecf99.png'),
('Стол «Воевода»', 'Компьютерный стол на стационарном подстолье', 'Дуб сращенный, бесцветный лак, размер 140×70×3 см', 35000, 'https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/14207a60-ff31-41bc-b485-213f1ac2aaee.jpeg'),
('Стол «Витязь»', 'Умный стол с подъёмным механизмом', 'Дуб сращенный, бесцветный лак, размер 150×60×3 см', 45000, 'https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/27618e2f-ba4f-4113-b909-79b3944b6d23.png');

INSERT INTO users (email, password_hash, name, is_admin) VALUES
('p606', 'f7b1d93f86ccb25f67c2c76b828552c732098bd1f00564c42ac4110e5fd5727d', 'Администратор', TRUE);