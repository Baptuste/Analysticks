import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import AsteroidBackground from '../components/AsteroidBackground';
import styles from './Accueil.module.css';

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <AsteroidBackground />

      <h1 className={styles.title}>Analysticks</h1>
      <img src="/logo-analysticks.png" alt="Logo" className={styles.logo} />

      <div className={styles.buttonRow}>
        <button className={styles.navButtonLeft} onClick={() => navigate('/stats')}>
          <ArrowLeft size={20} />
          Statistiques
        </button>

        <button className={styles.navButtonRight} onClick={() => navigate('/formulaire')}>
          Formulaire
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
