-- Check if English language exists, if not insert it
INSERT INTO "Language" (name, code)
SELECT 'English', 'en'
WHERE NOT EXISTS (
    SELECT 1 FROM "Language" WHERE code = 'en'
);

-- Check if Arabic language exists, if not insert it
INSERT INTO "Language" (name, code)
SELECT 'Arabic', 'ar'
WHERE NOT EXISTS (
    SELECT 1 FROM "Language" WHERE code = 'ar'
);
