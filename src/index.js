import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ✔️ on importe bien le composant App
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* ✔️ on affiche bien App ici */}
  </React.StrictMode>
);
