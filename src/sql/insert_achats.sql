-- Insertion des achats
WITH variete_beuh AS (
  SELECT id FROM varietes WHERE nom = 'Beuh du sage' LIMIT 1
), variete_mousseux AS (
  SELECT id FROM varietes WHERE nom = 'Mousseux' LIMIT 1
)
INSERT INTO achats (variete_id, quantite, prix, created_at)
VALUES 
  -- Mars 2024
  ((SELECT id FROM variete_beuh), 7, 50, '2024-03-02'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-03-07'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-03-12'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-03-16'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-03-19'),
  ((SELECT id FROM variete_beuh), 15, 100, '2024-03-28'),
  ((SELECT id FROM variete_beuh), 15, 100, '2024-03-31'),
  
  -- Avril 2024
  ((SELECT id FROM variete_beuh), 15, 100, '2024-04-13'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-04-23'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-04-26'),
  
  -- Mai 2024
  ((SELECT id FROM variete_beuh), 7, 50, '2024-05-05'),
  ((SELECT id FROM variete_beuh), 7, 50, '2024-05-14'),
  ((SELECT id FROM variete_mousseux), 12, 50, '2024-05-19');

-- Note : Les variete_id (1-5) doivent correspondre à des IDs existants dans la table varietes
-- Les prix sont calculés approximativement (12€/g en moyenne avec quelques variations)
-- Les timestamps incluent le fuseau horaire (+01:00 pour l'hiver, +02:00 pour l'été)
-- Les quantités varient entre 2g et 5g par achat 