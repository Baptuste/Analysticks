import {
  validateData,
  validateField,
  entrySchema,
  varieteSchema,
  achatSchema,
} from '../utils/validation';

describe('Validation Tests', () => {
  describe('entrySchema', () => {
    it('should validate a valid entry', async () => {
      const validEntry = {
        repartition: '50/50',
        longueur: 'Moyen',
        largeur: 'Normal',
        varieteId: '123',
        rating: 4,
      };

      const result = await validateData(entrySchema, validEntry);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validEntry);
    });

    it('should reject invalid repartition', async () => {
      const invalidEntry = {
        repartition: 'Invalid',
        longueur: 'Moyen',
        largeur: 'Normal',
        varieteId: '123',
      };

      const result = await validateData(entrySchema, invalidEntry);
      expect(result.isValid).toBe(false);
      expect(result.errors.repartition).toBe('Répartition invalide');
    });

    it('should reject rating out of range', async () => {
      const invalidEntry = {
        repartition: '50/50',
        longueur: 'Moyen',
        largeur: 'Normal',
        varieteId: '123',
        rating: 6,
      };

      const result = await validateData(entrySchema, invalidEntry);
      expect(result.isValid).toBe(false);
      expect(result.errors.rating).toBe('La note doit être au maximum 5');
    });
  });

  describe('varieteSchema', () => {
    it('should validate a valid variete', async () => {
      const validVariete = {
        nom: 'Test Variete',
        type: 'Beuh',
        origine: 'France',
      };

      const result = await validateData(varieteSchema, validVariete);
      expect(result.isValid).toBe(true);
    });

    it('should reject short name', async () => {
      const invalidVariete = {
        nom: 'A',
        type: 'Beuh',
      };

      const result = await validateData(varieteSchema, invalidVariete);
      expect(result.isValid).toBe(false);
      expect(result.errors.nom).toBe(
        'Le nom doit contenir au moins 2 caractères'
      );
    });
  });

  describe('achatSchema', () => {
    it('should validate a valid achat', async () => {
      const validAchat = {
        quantite: 10,
        prix: 50,
        varieteId: '123',
        date: new Date(),
      };

      const result = await validateData(achatSchema, validAchat);
      expect(result.isValid).toBe(true);
    });

    it('should reject negative quantity', async () => {
      const invalidAchat = {
        quantite: -5,
        prix: 50,
        varieteId: '123',
        date: new Date(),
      };

      const result = await validateData(achatSchema, invalidAchat);
      expect(result.isValid).toBe(false);
      expect(result.errors.quantite).toBe('La quantité doit être positive');
    });
  });

  describe('validateField', () => {
    it('should validate individual field', async () => {
      const result = await validateField(entrySchema, 'rating', 4);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject invalid individual field', async () => {
      const result = await validateField(entrySchema, 'rating', 6);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La note doit être au maximum 5');
    });
  });
});
