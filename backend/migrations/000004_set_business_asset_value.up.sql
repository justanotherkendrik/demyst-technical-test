ALTER TABLE businesses
ADD COLUMN asset_value NUMERIC DEFAULT 0;

UPDATE businesses SET asset_value = 100000 WHERE id = 1;
UPDATE businesses SET asset_value = -100000 WHERE id = 2;
UPDATE businesses SET asset_value = 2000 WHERE id = 3;
