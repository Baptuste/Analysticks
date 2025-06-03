import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';

// Chargement différé des pages avec un délai minimal pour assurer l'animation
const Accueil = lazy(() => 
  Promise.all([
    import('./pages/Accueil'),
    new Promise(resolve => setTimeout(resolve, 300))
  ]).then(([module]) => module)
);

const Formulaire = lazy(() => 
  Promise.all([
    import('./pages/Formulaire'),
    new Promise(resolve => setTimeout(resolve, 300))
  ]).then(([module]) => module)
);

const Statistiques = lazy(() => 
  Promise.all([
    import('./pages/Statistiques'),
    new Promise(resolve => setTimeout(resolve, 300))
  ]).then(([module]) => module)
);

// Configuration du routeur avec les futurs flags
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Accueil />
        },
        {
          path: "formulaire",
          element: <Formulaire />
        },
        {
          path: "stats",
          element: <Statistiques />
        }
      ]
    }
  ],
  {
    basename: process.env.PUBLIC_URL || '/',
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true
    }
  }
);

// Création de la racine React et rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </React.StrictMode>
);
