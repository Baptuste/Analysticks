import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accueil from './pages/Accueil';
import Formulaire from './pages/Formulaire';
import Statistiques from './pages/Statistiques';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/stats" element={<Statistiques />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
