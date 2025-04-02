import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Formulaire from './pages/Formulaire';
import Statistiques from './Statistiques';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Formulaire />} />
          <Route path="/stats" element={<Statistiques />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
