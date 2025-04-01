<<<<<<< HEAD
import React from 'react';
import Formulaire from './pages/Formulaire';
import './App.css'; // si tu utilises ce fichier pour des styles globaux

function App() {
  return (
    <div className="App">
      <Formulaire />
=======

import { useState } from "react";
import "./App.css";

function App() {
  const [repartition, setRepartition] = useState("");
  const [longueur, setLongueur] = useState("");
  const [largeur, setLargeur] = useState("");
  const [modeSpecial, setModeSpecial] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date().toISOString();

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxE8Y3DP6P9PGxnRoQBE7VyvzIq8gy17LresJczMjLg5YUzn7h7WQEuIbprl1V3UixJ/exec",
        {
          method: "POST",
          mode: "no-cors", // ✅ contourner le blocage CORS
          body: JSON.stringify({
            timestamp: now,
            repartition,
            longueur,
            largeur,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ On suppose que ça a fonctionné (pas de retour possible avec no-cors)
      setConfirmation("success");
      setRepartition("");
      setLongueur("");
      setLargeur("");
      setModeSpecial(false);
    } catch (error) {
      setConfirmation("error");
      console.error("Erreur d'envoi :", error);
    }

    setTimeout(() => {
      setConfirmation(null);
    }, 3000);
  };

  const buttonStyle = {
    backgroundColor: modeSpecial ? "#4CAF50" : "#D32F2F",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontWeight: "bold",
    borderRadius: "6px",
    marginBottom: "20px",
    cursor: "pointer",
  };

  return (
    <div className="container">
      <h1>📊 Analysticks</h1>

      <button onClick={() => setModeSpecial(!modeSpecial)} style={buttonStyle}>
        Spécial
      </button>

      <form onSubmit={handleSubmit}>
        <label>Répartition :</label>
        {modeSpecial ? (
          <input
            type="text"
            value={repartition}
            onChange={(e) => setRepartition(e.target.value)}
            placeholder="Ex : 40/60"
            required
          />
        ) : (
          <select
            value={repartition}
            onChange={(e) => setRepartition(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="Pure">Pure</option>
            <option value="10/90">10/90</option>
            <option value="20/80">20/80</option>
            <option value="30/70">30/70</option>
            <option value="40/60">40/60</option>
            <option value="50/50">50/50</option>
            <option value="60/40">60/40</option>
            <option value="70/30">70/30</option>
            <option value="Mixte">Mixte</option>
          </select>
        )}

        <label>Longueur :</label>
        {modeSpecial ? (
          <input
            type="text"
            value={longueur}
            onChange={(e) => setLongueur(e.target.value)}
            placeholder="Ex : Moyen +"
            required
          />
        ) : (
          <select
            value={longueur}
            onChange={(e) => setLongueur(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="Petit">Petit</option>
            <option value="Moyen -">Moyen -</option>
            <option value="Moyen">Moyen</option>
            <option value="Moyen +">Moyen +</option>
            <option value="Long">Long</option>
          </select>
        )}

        <label>Largeur :</label>
        {modeSpecial ? (
          <input
            type="text"
            value={largeur}
            onChange={(e) => setLargeur(e.target.value)}
            placeholder="Ex : Normal +"
            required
          />
        ) : (
          <select
            value={largeur}
            onChange={(e) => setLargeur(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="Skinny">Skinny</option>
            <option value="Normal -">Normal -</option>
            <option value="Normal">Normal</option>
            <option value="Normal +">Normal +</option>
            <option value="Bien">Bien</option>
          </select>
        )}

        <button type="submit">📨 Enregistrer</button>
      </form>

      {confirmation === "success" && (
        <div className="confirmation success">✅ Données enregistrées</div>
      )}
      {confirmation === "error" && (
        <div className="confirmation error">❌ Erreur d'envoi</div>
      )}
>>>>>>> 21d725322ed87b4dd76bf589532583160b76a8ba
    </div>
  );
}

export default App;
