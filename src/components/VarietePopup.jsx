import { useState } from 'react';
import { log } from '../utils/logger';
import styled from 'styled-components';
import { supabaseHelper } from '../lib/supabase';

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
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #fff;
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
  &:hover {
    background: #00ffaa;
  }
`;

const Message = styled.p`
  color: ${props => (props.$success ? '#00ff88' : '#ff5555')};
  text-align: center;
  margin-top: 1rem;
`;

const TYPES_VARIETES = [
  'Beuh',
  'Mousseux',
  'Dry',
  'Frozen',
  'Static',
  'Autres',
];

export default function VarietePopup({ isOpen, onClose, onAdd }) {
  const [nomVariete, setNomVariete] = useState('');
  const [typeVariete, setTypeVariete] = useState('');
  const [origineVariete, setOrigineVariete] = useState('');
  const [message, setMessage] = useState({ text: '', success: true });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nomVariete.trim() || !typeVariete) {
      setMessage({
        text: 'Le nom et le type de variété sont requis',
        success: false,
      });
      return;
    }

    try {
      const newVariete = await supabaseHelper.addVariete({
        nom: nomVariete.trim(),
        type: typeVariete,
        origine: origineVariete.trim() || null,
      });

      if (newVariete) {
        setMessage({ text: 'Variété ajoutée avec succès !', success: true });
        onAdd(newVariete);
        // Réinitialisation des champs
        setNomVariete('');
        setTypeVariete('');
        setOrigineVariete('');
        setTimeout(() => {
          onClose();
          setMessage({ text: '', success: true });
        }, 1500);
      } else {
        throw new Error(
          "Erreur lors de l'ajout de la variété : réponse invalide du serveur"
        );
      }
    } catch (error) {
      log.error("Erreur lors de l'ajout de la variété:", {
        error: error.message,
      });
      setMessage({
        text:
          error.message ||
          "Erreur lors de l'ajout de la variété. Veuillez réessayer.",
        success: false,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>
          Ajouter une variété
        </h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nom de la variété *</Label>
            <Input
              type="text"
              placeholder="Nom de la variété"
              value={nomVariete}
              onChange={e => setNomVariete(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Type de variété *</Label>
            <Select
              value={typeVariete}
              onChange={e => setTypeVariete(e.target.value)}
              required
            >
              <option value="">Sélectionnez un type</option>
              {TYPES_VARIETES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Origine (optionnel)</Label>
            <Input
              type="text"
              placeholder="Origine de la variété"
              value={origineVariete}
              onChange={e => setOrigineVariete(e.target.value)}
            />
          </FormGroup>

          <Button type="submit">Ajouter</Button>
        </Form>
        {message.text && (
          <Message $success={message.success}>{message.text}</Message>
        )}
      </PopupContent>
    </PopupOverlay>
  );
}
