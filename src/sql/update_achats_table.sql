-- Mise à jour de la table achats pour ajouter les timestamps automatiques
ALTER TABLE achats
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Activation de l'extension moddatetime si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Création du trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON achats;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON achats
    FOR EACH ROW 
    EXECUTE PROCEDURE moddatetime(updated_at); 