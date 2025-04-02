import React, { useState } from 'react';
import styles from './Formulaire.module.css';
import styled from 'styled-components';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpecialButton = styled.button`
  background-color: ${(props) => (props.$active ? '#00ff88' : '#cc0000')};
  color: ${(props) => (props.$active ? '#000000' : '#ffffff')};
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: bold;
  border: none;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export default function Formulaire() {
  const [modeSpecial, setModeSpecial] = useState(false);
  const [repartition, setRepartition] = useState('');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [message, setMessage] = useState('');
  const [puffVisible, setPuffVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!repartition || !longueur || !largeur) {
      alert('Merci de remplir tous les champs avant de valider.');
      return;
    }

    setPuffVisible(true);
    setTimeout(() => setPuffVisible(false), 1200);

    const data = {
      repartition,
      longueur,
      largeur,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycby4FwoVQl-fwYgKD_mcs-0X_Kzv8NarjDKUEJEcWKtMhkzKj-I-EMADRgzdYoW9h3Up/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setMessage('✅ Données envoyées !');
      setRepartition('');
      setLongueur('');
      setLargeur('');
    } catch (error) {
      setMessage('❌ Une erreur est survenue.');
      console.error("Erreur :", error);
    }
  };

  return (
    <div className={styles.formulaireContainer}>
      <button onClick={() => navigate('/')} className={styles.homeButton}>
        <Home size={24} color="#00ff88" />
      </button>

      <img src="/logo-analysticks.png" alt="Logo Analysticks" className={styles.logoGlow} />
      <h2>Analysticks</h2>

      <div className={styles.fieldGroup}>
        <label>Répartition :</label>
        {modeSpecial ? (
          <input type="text" value={repartition} onChange={(e) => setRepartition(e.target.value)} placeholder="Ex: 40/60" />
        ) : (
          <select value={repartition} onChange={(e) => setRepartition(e.target.value)}>
            <option value="" hidden></option>
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
      </div>

      <div className={styles.fieldGroup}>
        <label>Longueur :</label>
        {modeSpecial ? (
          <input type="text" value={longueur} onChange={(e) => setLongueur(e.target.value)} placeholder="Ex: Moyen +" />
        ) : (
          <select value={longueur} onChange={(e) => setLongueur(e.target.value)}>
            <option value="" hidden></option>
            <option value="Petit">Petit</option>
            <option value="Moyen -">Moyen -</option>
            <option value="Moyen">Moyen</option>
            <option value="Moyen +">Moyen +</option>
            <option value="Long">Long</option>
          </select>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label>Largeur :</label>
        {modeSpecial ? (
          <input type="text" value={largeur} onChange={(e) => setLargeur(e.target.value)} placeholder="Ex: Normal +" />
        ) : (
          <select value={largeur} onChange={(e) => setLargeur(e.target.value)}>
            <option value="" hidden></option>
            <option value="Skinny">Skinny</option>
            <option value="Normal -">Normal -</option>
            <option value="Normal">Normal</option>
            <option value="Normal +">Normal +</option>
            <option value="Bien">Bien</option>
          </select>
        )}
      </div>

      {puffVisible && <div className={styles.puffCloud}></div>}

      <button className={styles.smokeButton} onClick={handleSubmit}>
        Smoke
      </button>

      <div className={`${styles.specialButtonWrapper} ${modeSpecial ? styles.bounce : ''}`}>
        <SpecialButton $active={modeSpecial} onClick={() => setModeSpecial(!modeSpecial)}>
          Spécial
        </SpecialButton>
      </div>

      {message && (
        <p style={{ marginTop: '20px', color: '#00ff88', fontWeight: 'bold' }}>{message}</p>
      )}
    </div>
  );
}
