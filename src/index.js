import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Formulaire from './pages/Formulaire';
import Statistiques from './pages/Statistiques';
import Accueil from './pages/Accueil';

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
