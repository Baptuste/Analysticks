import React, { useState, useEffect } from 'react';
import styles from './Formulaire.module.css';
import styled from 'styled-components';
import { Home, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

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

const particlesInit = async (main) => {
  await loadSlim(main);
};

const particlesOptions = {
  fullScreen: { enable: true, zIndex: 0 },
  background: { color: { value: 'transparent' } },
  particles: {
    number: { value: 60 },
    color: { value: '#00ffcc' },
    shape: { type: 'circle' },
    opacity: {
      value: 0.6,
      anim: { enable: true, speed: 0.3, opacity_min: 0.2, sync: false }
    },
    size: {
      value: 2.5,
      random: true,
      anim: { enable: true, speed: 2, size_min: 0.5, sync: false }
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: 'none',
      outModes: { default: 'bounce' }
    },
    twinkle: {
      particles: {
        enable: true,
        color: '#00ffcc',
        frequency: 0.1,
        opacity: 1
      }
    }
  }
};

export default function Formulaire() {
  const [modeSpecial, setModeSpecial] = useState(false);
  const [repartition, setRepartition] = useState('');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [variete, setVariete] = useState('');
  const [message, setMessage] = useState('');
  const [puffVisible, setPuffVisible] = useState(false);
  const [varietes, setVarietes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNom, setNewNom] = useState('');
  const [newType, setNewType] = useState('Beuh');
  const [newOrigine, setNewOrigine] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les variétés depuis Google Sheets
    const fetchVarietes = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby4FwoVQl-fwYgKD_mcs-0X_Kzv8NarjDKUEJEcWKtMhkzKj-I-EMADRgzdYoW9h3Up/exec?sheet=Variété');
        const data = await response.json();
        setVarietes(data); // Mettez à jour les variétés dans le state
      } catch (error) {
        console.error('Erreur lors de la récupération des variétés:', error);
      }
    };
    fetchVarietes();
  }, []);

  const handleSubmit = async () => {
    if (!repartition || !longueur || !largeur || !variete) {
      alert('Merci de remplir tous les champs avant de valider.');
      return;
    }

    setPuffVisible(true);
    setTimeout(() => setPuffVisible(false), 1200);

    const data = {
      sheet: "données",
      repartition,
      longueur,
      largeur,
      variete,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycby4FwoVQl-fwYgKD_mcs-0X_Kzv8NarjDKUEJEcWKtMhkzKj-I-EMADRgzdYoW9h3Up/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setMessage('✅ Données envoyées !');
      setRepartition('');
      setLongueur('');
      setLargeur('');
      setVariete('');
    } catch (error) {
      setMessage('❌ Une erreur est survenue.');
      console.error("Erreur :", error);
    }
  };

  const handleAddVariete = async () => {
    if (!newNom.trim() || !newType || !newOrigine.trim()) return;

    const payload = {
      sheet: "Variété",
      nom: newNom.trim(),
      type: newType,
      origine: newOrigine.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycby4FwoVQl-fwYgKD_mcs-0X_Kzv8NarjDKUEJEcWKtMhkzKj-I-EMADRgzdYoW9h3Up/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setVarietes(prev => [...prev, newNom.trim()]); // Ajouter la variété à la liste
      setVariete(newNom.trim());
      setNewNom('');
      setNewOrigine('');
      setNewType('Beuh');
      setShowModal(false);
      setStatusMessage('✅ Variété ajoutée avec succès !');  // Message de succès
    } catch (error) {
      setStatusMessage('❌ Échec de l\'ajout de la variété.');  // Message d'échec
      console.error("Erreur lors de l'enregistrement de la variété:", error);
    }
  };

  return (
    <div className={styles.formulaireContainer}>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className={styles.particles} />

      <button onClick={() => navigate('/')} className={styles.homeButton}>
        <Home size={24} color="#00ff88" />
      </button>

      <img src="/logo-analysticks.png" alt="Logo Analysticks" className={styles.logoGlow} />
      <h2>Analysticks</h2>

      <div className={styles.fieldGroup}>
        <label>Répartition :</label>
        <select value={repartition} onChange={(e) => setRepartition(e.target.value)}>
          <option value="" hidden></option>
          {["Pure", "10/90", "20/80", "30/70", "40/60", "50/50", "60/40", "70/30", "Mixte"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Longueur :</label>
        <select value={longueur} onChange={(e) => setLongueur(e.target.value)}>
          <option value="" hidden></option>
          {["Petit", "Moyen -", "Moyen", "Moyen +", "Long"].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Largeur :</label>
        <select value={largeur} onChange={(e) => setLargeur(e.target.value)}>
          <option value="" hidden></option>
          {["Skinny", "Normal -", "Normal", "Normal +", "Bien"].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Variété :</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select value={variete} onChange={(e) => setVariete(e.target.value)} style={{ flex: 1 }}>
            <option value="" hidden></option>
            {varietes.map((v, i) => <option key={i} value={v}>{v}</option>)}
          </select>
          <button className={styles.addButton} onClick={() => setShowModal(!showModal)}>
            <Plus size={20} color="#00ff88" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Nouvelle variété</h3>
            <select value={newType} onChange={(e) => setNewType(e.target.value)}>
              {["Beuh", "Mousseux", "Dry", "Frozen", "Static", "Moonrock"].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input type="text" value={newOrigine} onChange={(e) => setNewOrigine(e.target.value)} placeholder="Origine" />
            <input type="text" value={newNom} onChange={(e) => setNewNom(e.target.value)} placeholder="Nom de la variété" />
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={handleAddVariete}>Ajouter</button>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {statusMessage && (
        <p style={{ marginTop: '20px', color: statusMessage.startsWith('✅') ? '#00ff88' : '#ff5555', fontWeight: 'bold' }}>
          {statusMessage}
        </p>
      )}

      {puffVisible && <div className={styles.puffCloud}></div>}

      <button className={styles.smokeButton} onClick={handleSubmit}>Smoke</button>

      <div className={`${styles.specialButtonWrapper} ${modeSpecial ? styles.bounce : ''}`}>
        <SpecialButton $active={modeSpecial} onClick={() => setModeSpecial(!modeSpecial)}>Spécial</SpecialButton>
      </div>

      {message && <p style={{ marginTop: '20px', color: '#00ff88', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}
