import React, { useState } from 'react';
import styled from 'styled-components';
import { supabaseHelper } from '../lib/supabase';
import { X } from 'lucide-react';

const PopupOverlay = styled.div`
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
`;

const PopupContent = styled.div`
  background: #111;
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid #00ff88;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #00ff88;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #00ff88;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #00ff88;
  background: #222;
  color: #fff;
  &:focus {
    outline: none;
    border-color: #00ffaa;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #00ff88;
  background: #222;
  color: #fff;
  &:focus {
    outline: none;
    border-color: #00ffaa;
  }
`;

const Button = styled.button`
  background: #00ff88;
  color: #000;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #00ffaa;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  text-align: center;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: #00ff88;
  text-align: center;
  margin-top: 0.5rem;
`;

export default function AchatPopup({ isOpen, onClose, varietes, onAchatComplete }) {
  const [varieteId, setVarieteId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!varieteId || !quantite || !prix) {
      setError('Tous les champs sont requis');
      return;
    }

    try {
      const { data, error } = await supabaseHelper.addAchat({
        variete_id: varieteId,
        quantite: parseFloat(quantite),
        prix: parseFloat(prix)
      });

      if (error) throw error;

      setSuccess('✅ Achat enregistré avec succès !');
      if (onAchatComplete) onAchatComplete();

      // Réinitialiser le formulaire
      setVarieteId('');
      setQuantite('');
      setPrix('');

      // Fermer le popup après un délai
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'achat:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  if (!isOpen) return null;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        
        <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>Nouvel Achat</h2>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Variété *</Label>
            <Select
              value={varieteId}
              onChange={(e) => setVarieteId(e.target.value)}
              required
            >
              <option value="">Sélectionnez une variété</option>
              {varietes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nom} ({v.type}){v.origine ? ` - ${v.origine}` : ''}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Quantité *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Quantité"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Prix *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="Prix"
              required
            />
          </FormGroup>

          <Button type="submit">Enregistrer l'achat</Button>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </PopupContent>
    </PopupOverlay>
  );
} 