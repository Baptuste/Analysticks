-- Configuration du fuseau horaire pour la session
SET timezone = 'UTC';

-- Création d'une fonction pour l'import
CREATE OR REPLACE FUNCTION import_achat_historique(
  p_variete_id UUID,
  p_quantite NUMERIC,
  p_prix NUMERIC,
  p_date TIMESTAMPTZ
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO achats (variete_id, quantite, prix, created_at)
  VALUES (p_variete_id, p_quantite, p_prix, p_date)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Suppression des données existantes si nécessaire
TRUNCATE TABLE achats;

-- Import des données historiques
DO $$
BEGIN
  -- Mars 2025
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-02 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-07 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-12 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-16 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-03-19 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-03-28 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-03-31 12:00:00+00'::timestamptz);

  -- Avril 2025
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 15, 100, '2025-04-13 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-04-23 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-04-26 12:00:00+00'::timestamptz);

  -- Mai 2025
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-05-05 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('01da889d-fce4-4500-8f86-3b44e01daad2', 7, 50, '2025-05-14 12:00:00+00'::timestamptz);
  PERFORM import_achat_historique('84b4e6ea-6f97-4c65-ae59-0e595dd14757', 12, 50, '2025-05-19 12:00:00+00'::timestamptz);
END $$;

-- Suppression de la fonction temporaire
DROP FUNCTION import_achat_historique;

-- Vérification des données insérées
SELECT 
  v.nom as variete,
  a.created_at AT TIME ZONE 'UTC' as date_utc,
  a.created_at AT TIME ZONE 'Europe/Paris' as date_fr,
  a.quantite,
  a.prix
FROM achats a
JOIN varietes v ON v.id = a.variete_id
ORDER BY a.created_at; 