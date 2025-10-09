import * as yup from 'yup';

// Schéma de validation pour une entrée
export const entrySchema = yup.object({
  repartition: yup
    .string()
    .required('La répartition est requise')
    .oneOf(
      [
        'Pure',
        '10/90',
        '20/80',
        '30/70',
        '40/60',
        '50/50',
        '60/40',
        '70/30',
        'Mixte',
      ],
      'Répartition invalide'
    ),

  longueur: yup
    .string()
    .required('La longueur est requise')
    .oneOf(
      ['Petit', 'Moyen -', 'Moyen', 'Moyen +', 'Long'],
      'Longueur invalide'
    ),

  largeur: yup
    .string()
    .required('La largeur est requise')
    .oneOf(
      ['Skinny', 'Normal -', 'Normal', 'Normal +', 'Bien'],
      'Largeur invalide'
    ),

  varieteId: yup.string().required('La variété est requise'),

  rating: yup
    .number()
    .nullable()
    .min(1, 'La note doit être au moins 1')
    .max(5, 'La note doit être au maximum 5')
    .transform(value => (isNaN(value) ? null : value)),
});

// Schéma de validation pour une variété
export const varieteSchema = yup.object({
  nom: yup
    .string()
    .required('Le nom de la variété est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),

  type: yup
    .string()
    .required('Le type est requis')
    .oneOf(
      ['Beuh', 'Mousseux', 'Dry', 'Frozen', 'Static', 'Autres'],
      'Type invalide'
    ),

  origine: yup
    .string()
    .nullable()
    .max(100, "L'origine ne peut pas dépasser 100 caractères")
    .trim(),
});

// Schéma de validation pour un achat
export const achatSchema = yup.object({
  quantite: yup
    .number()
    .required('La quantité est requise')
    .positive('La quantité doit être positive')
    .max(1000, 'La quantité ne peut pas dépasser 1000'),

  prix: yup
    .number()
    .required('Le prix est requis')
    .positive('Le prix doit être positif')
    .max(10000, 'Le prix ne peut pas dépasser 10000'),

  varieteId: yup.string().required('La variété est requise'),

  date: yup
    .date()
    .required('La date est requise')
    .max(new Date(), 'La date ne peut pas être dans le futur'),
});

// Fonction de validation générique
export const validateData = async (schema, data) => {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    return { isValid: true, data: validatedData, errors: null };
  } catch (error) {
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    return { isValid: false, data: null, errors };
  }
};

// Validation en temps réel
export const validateField = async (schema, field, value) => {
  try {
    await schema.validateAt(field, { [field]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};
