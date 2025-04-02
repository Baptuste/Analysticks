import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import styles from './Statistiques.module.css';

export default function Statistiques() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
      >
        <source src="/bg-stats-loop-5s.mp4" type="video/mp4" />
      </video>

      <button
        className={styles.homeButton}
        onClick={() => navigate('/')}
        aria-label="Retour à l'accueil"
      >
        <Home size={28} color="#00ff88" />
      </button>

      <div className={styles.content}>
        <h1>📊 Statistiques</h1>
        <p>Les analyses arrivent fort.</p>
      </div>
    </div>
  );
}
