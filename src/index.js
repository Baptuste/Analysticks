import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assure-toi que ce fichier existe pour les styles globaux (même vide)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
