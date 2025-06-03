# 📊 Analysticks

Application de suivi et d'analyse statistique développée avec React et Supabase.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Structure des données](#structure-des-données)
- [Composants principaux](#composants-principaux)
- [Animations et UI](#animations-et-ui)

## 🎯 Aperçu

Analysticks est une application web permettant de suivre et d'analyser des données d'achats et de consommation. Elle offre une interface moderne et intuitive avec des visualisations de données en temps réel.

## ✨ Fonctionnalités

### 📈 Statistiques globales
- Suivi du nombre total d'achats
- Calcul du prix moyen par gramme
- Affichage des détails du dernier achat
- Graphique d'évolution temporelle
- Comparaisons hebdomadaires et mensuelles

### 🔄 Gestion des achats
- Enregistrement des nouveaux achats
- Suivi des quantités et prix
- Association avec des variétés
- Historique complet des transactions

### 📊 Analyses par variété
- Statistiques détaillées par type
- Suivi des quantités par variété
- Prix moyens par catégorie
- Graphiques de répartition

### 🎨 Interface utilisateur
- Design moderne et responsive
- Animations fluides
- Thème sombre personnalisé
- Indicateurs de chargement animés

## 🏗 Architecture

### Structure du projet
```
src/
├── components/         # Composants réutilisables
├── pages/             # Pages principales
├── lib/               # Utilitaires et services
├── styles/            # Styles globaux
└── assets/            # Ressources statiques
```

### Base de données (Supabase)
- Table `achats`: Transactions
- Table `varietes`: Catalogue des variétés
- Relations entre achats et variétés

## 🛠 Technologies utilisées

### Frontend
- React 18
- React Router 6
- Styled Components
- Recharts (visualisations)
- React-tsparticles (effets visuels)

### Backend
- Supabase (Base de données et authentification)
- API REST

### Outils de développement
- Create React App
- ESLint
- Prettier

## 💻 Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
REACT_APP_SUPABASE_URL=votre_url
REACT_APP_SUPABASE_ANON_KEY=votre_clé
```

4. Lancer l'application
```bash
npm start
```

## 📝 Structure des données

### Achat
```typescript
interface Achat {
  id: string
  created_at: string
  quantite: number
  prix: number
  variete_id: string
  varietes: Variete
}
```

### Variété
```typescript
interface Variete {
  id: string
  nom: string
  type: string
  description?: string
}
```

## 🧩 Composants principaux

### AchatsStats
- Affichage des statistiques d'achats
- Graphiques d'évolution
- KPIs principaux

### LoadingBattery
- Animation de chargement personnalisée
- Transition de couleurs
- Indicateur de progression

### Formulaire
- Saisie des nouveaux achats
- Validation des données
- Interface intuitive

## 🎨 Animations et UI

### Transitions de pages
- Chargement progressif
- Animations fluides
- Retours visuels

### Particules
- Effets visuels dynamiques
- Ambiance immersive
- Performance optimisée

### Thème
- Palette de couleurs cohérente
- Contraste optimal
- Accessibilité respectée

## 🔄 Processus métier

### Enregistrement d'un achat
1. Saisie des informations
2. Validation des données
3. Enregistrement en base
4. Mise à jour des statistiques

### Calcul des statistiques
1. Récupération des données
2. Traitement et agrégation
3. Calcul des indicateurs
4. Mise à jour des visualisations

### Gestion des variétés
1. Catalogue maintenu
2. Association aux achats
3. Statistiques dédiées

## 🔒 Sécurité

- Authentification Supabase
- Protection des routes
- Validation des données
- Gestion des erreurs

## 🚀 Performance

- Chargement différé des composants
- Optimisation des requêtes
- Mise en cache des données
- Animations optimisées

## 📱 Responsive

- Adaptation mobile
- Interfaces flexibles
- Composants réactifs
- Expérience cohérente

## 🔄 Mises à jour futures

- [ ] Mode hors ligne
- [ ] Notifications push
- [ ] Export des données
- [ ] Thèmes personnalisables
- [ ] Nouveaux types de graphiques
