-- Insertion des variétés
INSERT INTO varietes (nom, type)
VALUES 
  ('Beuh du sage', 'Beuh'),
  ('Mousseux', 'Mousseux')
RETURNING id; 