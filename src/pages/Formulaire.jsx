import React, { useState, useEffect } from 'react';
import styles from './Formulaire.module.css';
import styled from 'styled-components';
import { Home, Plus, Star, Edit, List, Check, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import VarietePopup from '../components/VarietePopup';
import { supabaseHelper } from '../lib/supabase';
import AchatPopup from '../components/AchatPopup';

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

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${props => props.$active ? '#00ff88' : '#333'};
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: #00ff88;
  }
`;

const InputModeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px solid #00ff88;
  color: #00ff88;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
  }
`;

const FreeInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #00ff88;
  background: rgba(26, 26, 26, 0.95);
  color: white;
  font-size: 1rem;
  outline: none;
`;

const RatingLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const RatingValue = styled.span`
  color: #00ff88;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #00ff88;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  font-weight: bold;
`;

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConfirmationContent = styled.div`
  background: #111;
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid #00ff88;
  text-align: center;
  animation: scaleIn 0.3s ease-out;
  max-width: 90%;
  width: 400px;

  @keyframes scaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ConfirmationIcon = styled.div`
  color: #00ff88;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 48px;
    height: 48px;
    stroke-width: 3px;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;

const ConfirmationMessage = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin: 1rem 0;
`;

const ScrollingBanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 255, 136, 0.1);
  border-bottom: 1px solid #00ff88;
  padding: 0.5rem;
  color: #00ff88;
  font-size: 0.9rem;
  text-align: center;
  z-index: 1000;
  white-space: nowrap;
  overflow: hidden;

  @keyframes scroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  span {
    display: inline-block;
    animation: scroll 12s linear infinite;
    padding-right: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
`;

const Title = styled.h1`
  color: #00ff88;
  text-align: center;
  font-size: 2rem;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: none;
  border: 2px solid #00ff88;
  border-radius: 50%;
  min-width: 35px;
  min-height: 35px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  margin: 0;
  margin-left: 8px;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    transform: scale(1.1);
  }
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 400px;
`;

const SelectWrapper = styled.div`
  flex: 1;
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid #00ff88;
  border-radius: 10px;
  display: flex;
  align-items: center;
  min-width: 200px;
  max-width: 300px;
  padding-right: 8px;

  select {
  width: 100%;
    padding: 12px;
    border: none;
  background: transparent;
  color: white;
    outline: none;
    font-size: 1rem;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;

  option {
    background: #1a1a1a;
      padding: 10px;
    }

    &::-ms-expand {
      display: none;
    }
  }
`;

export default function Formulaire() {
  const [repartition, setRepartition] = useState('');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [varieteId, setVarieteId] = useState('');
  const [message, setMessage] = useState('');
  const [puffVisible, setPuffVisible] = useState(false);
  const [varietes, setVarietes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isFreeInput, setIsFreeInput] = useState(false);
  const [customRepartition, setCustomRepartition] = useState('');
  const [customLongueur, setCustomLongueur] = useState('');
  const [customLargeur, setCustomLargeur] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastSubmissionDate, setLastSubmissionDate] = useState(null);
  const [isAchatPopupOpen, setIsAchatPopupOpen] = useState(false);

  const navigate = useNavigate();

  // Chargement des variétés depuis Supabase
  useEffect(() => {
    const fetchVarietes = async () => {
      try {
        const data = await supabaseHelper.getAllVarietes();
        if (Array.isArray(data)) {
          setVarietes(data);
          setError('');
        } else {
          setError('Format de données invalide pour les variétés');
          setVarietes([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des variétés:', error);
        setError('❌ Impossible de charger les variétés. Veuillez vérifier votre connexion et réessayer.');
        setVarietes([]);
      }
    };
    fetchVarietes();
  }, []);

  useEffect(() => {
    const fetchLastSubmission = async () => {
      try {
        const lastEntry = await supabaseHelper.getLastEntry();
        if (lastEntry) {
          setLastSubmissionDate(new Date(lastEntry.timestamp));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la dernière soumission:', error);
        // Ne pas afficher d'erreur à l'utilisateur si c'est la première utilisation
      }
    };

    fetchLastSubmission();
  }, []);

  // Réinitialiser tous les champs
  const resetForm = () => {
    setRepartition('');
    setLongueur('');
    setLargeur('');
    setVarieteId('');
    setRating(0);
    setCustomRepartition('');
    setCustomLongueur('');
    setCustomLargeur('');
    setError('');
    setMessage('');
  };

  // Validation des champs
  const validateFields = () => {
    if (!varieteId) {
      setError('Veuillez sélectionner une variété');
      return false;
    }

    if (isFreeInput) {
      if (!customRepartition.trim()) {
        setError('Veuillez entrer une répartition');
        return false;
      }
      if (!customLongueur.trim()) {
        setError('Veuillez entrer une longueur');
        return false;
      }
      if (!customLargeur.trim()) {
        setError('Veuillez entrer une largeur');
        return false;
      }
    } else {
      if (!repartition) {
        setError('Veuillez sélectionner une répartition');
        return false;
      }
      if (!longueur) {
        setError('Veuillez sélectionner une longueur');
        return false;
      }
      if (!largeur) {
        setError('Veuillez sélectionner une largeur');
        return false;
      }
    }

    return true;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Soumettre les données
  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    setPuffVisible(true);
    setTimeout(() => setPuffVisible(false), 1200);

    try {
      const entryData = {
        repartition: isFreeInput ? customRepartition.trim() : repartition,
        longueur: isFreeInput ? customLongueur.trim() : longueur,
        largeur: isFreeInput ? customLargeur.trim() : largeur,
        varieteId,
        rating: rating || null
      };

      await supabaseHelper.addEntry(entryData);
      setLastSubmissionDate(new Date());
      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
        resetForm();
      }, 2000);

      setMessage('✅ Données envoyées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi des données');
    }
  };

  const handleAddVariete = async (newVariete) => {
    if (!newVariete) {
      setError('La variété est requise');
      return;
    }

    try {
      setVarietes(prev => [...prev, newVariete]);
      setError('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la variété:', error);
      setError(error.message || 'Erreur lors de l\'ajout de la variété');
    }
  };

  const toggleInputMode = () => {
    setIsFreeInput(!isFreeInput);
    // Réinitialiser les valeurs lors du changement de mode
    setRepartition('');
    setLongueur('');
    setLargeur('');
    setCustomRepartition('');
    setCustomLongueur('');
    setCustomLargeur('');
  };

  return (
    <div className={styles.formulaireContainer}>
      {lastSubmissionDate && (
        <ScrollingBanner>
          <span>
            🕒 Dernier envoi le : {formatDate(lastSubmissionDate)}
          </span>
        </ScrollingBanner>
      )}
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className={styles.particles} />
      <button onClick={() => navigate('/')} className={styles.homeButton}>
        <Home size={24} color="#00ff88" />
      </button>

      <img src="/logo-analysticks.png" alt="Logo Analysticks" className={styles.logoGlow} />
      <Title>Analysticks</Title>

      <InputModeToggle onClick={toggleInputMode}>
        {isFreeInput ? (
          <>
            <List size={16} />
            Mode sélection
          </>
        ) : (
          <>
            <Edit size={16} />
            Mode libre
          </>
        )}
      </InputModeToggle>

      <div className={styles.fieldGroup}>
        <label>Répartition :</label>
        {isFreeInput ? (
          <FreeInput
            type="text"
            value={customRepartition}
            onChange={(e) => setCustomRepartition(e.target.value)}
            placeholder="Entrez la répartition"
          />
        ) : (
          <select value={repartition} onChange={(e) => setRepartition(e.target.value)}>
            <option value="" hidden></option>
            {['Pure', '10/90', '20/80', '30/70', '40/60', '50/50', '60/40', '70/30', 'Mixte'].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label>Longueur :</label>
        {isFreeInput ? (
          <FreeInput
            type="text"
            value={customLongueur}
            onChange={(e) => setCustomLongueur(e.target.value)}
            placeholder="Entrez la longueur"
          />
        ) : (
          <select value={longueur} onChange={(e) => setLongueur(e.target.value)}>
            <option value="" hidden></option>
            {['Petit', 'Moyen -', 'Moyen', 'Moyen +', 'Long'].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label>Largeur :</label>
        {isFreeInput ? (
          <FreeInput
            type="text"
            value={customLargeur}
            onChange={(e) => setCustomLargeur(e.target.value)}
            placeholder="Entrez la largeur"
          />
        ) : (
          <select value={largeur} onChange={(e) => setLargeur(e.target.value)}>
            <option value="" hidden></option>
            {['Skinny', 'Normal -', 'Normal', 'Normal +', 'Bien'].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <RatingLabel>
          <label>Note :</label>
          <RatingValue>{rating ? `${rating}/5` : 'Non noté'}</RatingValue>
        </RatingLabel>
        <StarRatingContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              onClick={() => setRating(star === rating ? 0 : star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              $active={star <= (hoveredRating || rating)}
              type="button"
              aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
            >
              <Star 
                size={24} 
                fill={star <= (hoveredRating || rating) ? '#00ff88' : 'none'}
                stroke={star <= (hoveredRating || rating) ? '#00ff88' : '#333'}
              />
            </StarButton>
          ))}
        </StarRatingContainer>
      </div>

      <div className={styles.fieldGroup}>
        <label>Variété :</label>
          <SelectContainer>
            <SelectWrapper>
            <select 
                value={varieteId} 
                onChange={(e) => setVarieteId(e.target.value)}
              >
              <option value=""></option>
                {varietes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nom} ({v.type}){v.origine ? ` - ${v.origine}` : ''}
                  </option>
                ))}
            </select>
            </SelectWrapper>
          <ActionButton
            onClick={() => setIsPopupOpen(true)}
            title="Ajouter une variété"
            type="button"
          >
            <Plus size={20} color="#00ff88" />
          </ActionButton>
          <ActionButton
            onClick={() => setIsAchatPopupOpen(true)}
            title="Nouvel achat"
            type="button"
          >
                <ShoppingCart size={18} color="#00ff88" />
          </ActionButton>
          </SelectContainer>
      </div>

      <button 
        className={styles.smokeButton} 
        onClick={handleSubmit}
        disabled={puffVisible}
      >
        {puffVisible ? 'Envoi...' : 'Smoke'}
      </button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <SuccessMessage>{message}</SuccessMessage>}

      {puffVisible && <div className={styles.puffCloud} />}

      {showConfirmation && (
        <ConfirmationOverlay>
          <ConfirmationContent>
            <ConfirmationIcon>
              <Check />
            </ConfirmationIcon>
            <ConfirmationMessage>Données enregistrées avec succès !</ConfirmationMessage>
          </ConfirmationContent>
        </ConfirmationOverlay>
      )}

      <VarietePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAdd={handleAddVariete}
      />

      <AchatPopup
        isOpen={isAchatPopupOpen}
        onClose={() => setIsAchatPopupOpen(false)}
        varietes={varietes}
        onAchatComplete={() => {
          // Vous pouvez ajouter ici une logique pour rafraîchir les données si nécessaire
        }}
      />
    </div>
  );
}
