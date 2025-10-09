// // Remplacement: console.warn → log.warn
// // Remplacement: console.error → log.error
import { createClient } from '@supabase/supabase-js';
import { log } from '../utils/logger';

// ✅ CONFIGURATION SUPABASE
const supabaseUrl = 'https://ckseyrmpywyczywfdmhu.supabase.co';
const supabaseKey =
  process.env.REACT_APP_SUPABASE_KEY ||
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc2V5cm1weXd5Y3p5d2ZkbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTg4NTEsImV4cCI6MjA2MzgzNDg1MX0.HXunSRev4E_oy7bSXyPF70q233eAuslmXBJuN_CxPO4';

// Configuration Supabase - Clé hardcodée pour le développement
// En production, utilisez les variables d'environnement REACT_APP_SUPABASE_KEY

// Créer une instance unique du client Supabase
let supabaseInstance = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: 'analysticks-storage-key',
      },
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

// Validation des données
const validateEntry = data => {
  const errors = [];

  if (!data.repartition) {
    errors.push('La répartition est requise');
  }

  if (!data.longueur) {
    errors.push('La longueur est requise');
  }

  if (!data.largeur) {
    errors.push('La largeur est requise');
  }

  if (!data.varieteId) {
    errors.push('La variété est requise');
  }

  if (data.rating !== null && (data.rating < 1 || data.rating > 5)) {
    errors.push('La note doit être comprise entre 1 et 5');
  }

  return errors;
};

// Fonctions d'aide pour les opérations Supabase
export const supabaseHelper = {
  // Récupérer toutes les entrées
  async getAllEntries() {
    try {
      const { data, error } = await supabase
        .from('sticks')
        .select(
          `
          *,
          variete:variete_id (
            id,
            nom,
            type,
            origine
          )
        `
        )
        .order('timestamp', { ascending: false });

      if (error) {
        log.error('Erreur getAllEntries:', error);
        throw error;
      }
      return data || [];
    } catch (err) {
      log.error('Erreur getAllEntries:', err);
      throw err;
    }
  },

  // Ajouter une nouvelle entrée
  async addEntry({ repartition, longueur, largeur, varieteId, rating }) {
    try {
      // Validation des données
      const validationErrors = validateEntry({
        repartition,
        longueur,
        largeur,
        varieteId,
        rating,
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Nettoyage des données
      const cleanData = {
        repartition: repartition.trim(),
        longueur: longueur.trim(),
        largeur: largeur.trim(),
        variete_id: varieteId,
        rating: rating || null,
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('sticks').insert([cleanData])
        .select(`
          *,
          variete:variete_id (
            id,
            nom,
            type,
            origine
          )
        `);

      if (error) {
        log.error('Erreur addEntry:', error);
        throw new Error(error.message);
      }

      if (!data?.[0]) {
        throw new Error("Aucune donnée n'a été retournée après l'insertion");
      }

      return data[0];
    } catch (err) {
      log.error('Erreur addEntry:', err);
      throw new Error(
        err.message || "Une erreur est survenue lors de l'ajout de l'entrée"
      );
    }
  },

  // Récupérer toutes les variétés
  async getAllVarietes() {
    try {
      const { data, error } = await supabase
        .from('varietes')
        .select('*')
        .order('nom');

      if (error) {
        log.error('Erreur getAllVarietes:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      log.error('Erreur getAllVarietes:', err);
      throw new Error(
        err.message ||
          'Une erreur est survenue lors de la récupération des variétés'
      );
    }
  },

  // Ajouter une nouvelle variété
  async addVariete({ nom, type, origine }) {
    try {
      if (!nom || typeof nom !== 'string' || !type) {
        throw new Error('Le nom et le type de la variété sont requis');
      }

      const { data, error } = await supabase
        .from('varietes')
        .insert([
          {
            nom: nom.trim(),
            type,
            origine: origine?.trim() || null,
          },
        ])
        .select();

      if (error) {
        log.error('Erreur addVariete:', error);
        throw error;
      }
      return data?.[0];
    } catch (err) {
      log.error('Erreur addVariete:', err);
      throw err;
    }
  },

  // Récupérer les statistiques hebdomadaires
  async getWeeklyStats() {
    try {
      const { data, error } = await supabase
        .from('sticks')
        .select(
          `
          *,
          variete:variete_id (
            id,
            nom,
            type,
            origine
          )
        `
        )
        .order('timestamp', { ascending: true });

      if (error) {
        log.error('Erreur getWeeklyStats:', error);
        throw error;
      }

      // Grouper les données par semaine
      const weeklyData = data.reduce((acc, entry) => {
        const date = new Date(entry.timestamp);
        const weekNumber = getWeekNumber(date);
        const weekKey = `${date.getFullYear()}-W${weekNumber}`;

        if (!acc[weekKey]) {
          acc[weekKey] = {
            count: 0,
            types: {},
            repartitions: {},
            varietes: {},
          };
        }

        // Incrémenter le compteur total
        acc[weekKey].count++;

        // Compter par type de variété
        const type = entry.variete.type;
        acc[weekKey].types[type] = (acc[weekKey].types[type] || 0) + 1;

        // Compter par répartition
        acc[weekKey].repartitions[entry.repartition] =
          (acc[weekKey].repartitions[entry.repartition] || 0) + 1;

        // Compter par variété
        const varieteKey = `${entry.variete.nom} (${entry.variete.type})`;
        acc[weekKey].varietes[varieteKey] =
          (acc[weekKey].varietes[varieteKey] || 0) + 1;

        return acc;
      }, {});

      return weeklyData;
    } catch (err) {
      log.error('Erreur getWeeklyStats:', err);
      throw err;
    }
  },

  // Récupérer la dernière entrée
  async getLastEntry() {
    try {
      const { data, error } = await supabase
        .from('sticks')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        log.error('Erreur getLastEntry:', error);
        return null;
      }

      return data;
    } catch (err) {
      log.error('Erreur getLastEntry:', err);
      return null;
    }
  },

  async addAchat(achat) {
    try {
      // Validation des données d'achat
      if (!achat.variete_id || !achat.quantite || !achat.prix) {
        throw new Error('La variété, la quantité et le prix sont requis');
      }

      // S'assurer que les valeurs sont des nombres
      const cleanData = {
        variete_id: achat.variete_id,
        quantite: Number(achat.quantite),
        prix: Number(achat.prix),
        created_at: achat.forceDate
          ? achat.created_at
          : new Date().toISOString(),
      };

      // Vérifier que les valeurs sont valides
      if (isNaN(cleanData.quantite) || cleanData.quantite <= 0) {
        throw new Error('La quantité doit être un nombre positif');
      }
      if (isNaN(cleanData.prix) || cleanData.prix <= 0) {
        throw new Error('Le prix doit être un nombre positif');
      }

      const { data, error } = await supabase
        .from('achats')
        .insert([cleanData])
        .select();

      if (error) {
        if (error.message.includes('auth')) {
          throw new Error('Vous devez être connecté pour effectuer un achat');
        }
        throw new Error(error.message);
      }

      return { data: data?.[0], error: null };
    } catch (error) {
      log.error("Erreur lors de l'ajout de l'achat:", error);
      return { data: null, error };
    }
  },

  async getAchats() {
    try {
      const { data, error } = await supabase
        .from('achats')
        .select(
          `
          *,
          varietes (
            id,
            nom,
            type,
            origine
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      log.error('Erreur lors de la récupération des achats:', error);
      throw error;
    }
  },

  async getSticksByVariete(varieteId) {
    try {
      const { data, error } = await supabase
        .from('sticks')
        .select('*')
        .eq('variete_id', varieteId);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      log.error('Erreur lors de la récupération des sticks:', error);
      return 0;
    }
  },
};

// Fonction utilitaire pour obtenir le numéro de la semaine
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
