-- Configuration du fuseau horaire pour la session
SET timezone = 'UTC';

-- Suppression des données existantes
TRUNCATE TABLE achats;

-- Insertion des nouvelles données avec dates spécifiques
DO $$
DECLARE
  v_id uuid;
BEGIN
  -- Mars 2025
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-02T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-07T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-12T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-16T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-19T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-03-28T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-03-31T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  -- Avril 2025
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-04-13T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-04-23T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-04-26T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  -- Mai 2025
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-05-05T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-05-14T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
  
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES ('84b4e6ea-6f97-4c65-ae59-0e595dd14757', 12, 50, '2025-05-19T12:00:00.000Z'::timestamptz)
  RETURNING id INTO v_id;
END $$;

-- Vérification des données insérées
SELECT 
  v.nom as variete,
  a.created_at as date_utc,
  TO_CHAR(a.created_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY') as date_fr,
  TO_CHAR(a.created_at AT TIME ZONE 'Europe/Paris', 'HH24:MI:SS') as heure
FROM achats a
JOIN varietes v ON v.id = a.variete_id
ORDER BY a.created_at; 