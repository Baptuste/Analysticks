import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Formulaire from './pages/Formulaire';
import Statistiques from './pages/Statistiques';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/stats" element={<Statistiques />} />
      </Routes>
    </Router>
  );
}

export default App; 