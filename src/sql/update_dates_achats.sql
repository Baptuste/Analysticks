-- Mise à jour des dates des achats existants
WITH achats_dates AS (
  SELECT 
    ROW_NUMBER() OVER (ORDER BY created_at) as rn,
    id
  FROM achats
  WHERE variete_id = (SELECT id FROM varietes WHERE nom = 'Beuh du sage' LIMIT 1)
  ORDER BY created_at
)
UPDATE achats
SET created_at = CASE 
  WHEN rn = 1 THEN '2024-03-02'::date
  WHEN rn = 2 THEN '2024-03-07'::date
  WHEN rn = 3 THEN '2024-03-12'::date
  WHEN rn = 4 THEN '2024-03-16'::date
  WHEN rn = 5 THEN '2024-03-19'::date
  WHEN rn = 6 THEN '2024-03-28'::date
  WHEN rn = 7 THEN '2024-03-31'::date
  WHEN rn = 8 THEN '2024-04-13'::date
  WHEN rn = 9 THEN '2024-04-23'::date
  WHEN rn = 10 THEN '2024-04-26'::date
  WHEN rn = 11 THEN '2024-05-05'::date
  WHEN rn = 12 THEN '2024-05-14'::date
END
FROM achats_dates
WHERE achats.id = achats_dates.id;

-- Mise à jour de la date pour Mousseux
UPDATE achats
SET created_at = '2024-05-19'::date
WHERE variete_id = (SELECT id FROM varietes WHERE nom = 'Mousseux' LIMIT 1); 