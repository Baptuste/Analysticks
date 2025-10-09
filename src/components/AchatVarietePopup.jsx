import { useState } from 'react';
import { log } from '../utils/logger';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { supabaseHelper } from '../lib/supabase';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: #111;
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid #00ff88;
  width: 90%;
  max-width: 500px;
  position: relative;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #00ff88;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    transform: rotate(90deg);
  }
`;

const Title = styled.h2`
  color: #00ff88;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
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
  background: #1a1a1a;
  border: 2px solid #00ff88;
  border-radius: 8px;
  padding: 0.8rem;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
`;

const Select = styled.select`
  background: #1a1a1a;
  border: 2px solid #00ff88;
  border-radius: 8px;
  padding: 0.8rem;
  color: white;
  font-size: 1rem;
  outline: none;
  cursor: pointer;

  &:focus {
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
`;

const Button = styled.button`
  background: #00ff88;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #00cc6a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
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
`;

export default function AchatVarietePopup({
  isOpen,
  onClose,
  varietes,
  onAchatComplete,
}) {
  const [selectedVariete, setSelectedVariete] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!selectedVariete || !quantite || !prix) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const achat = {
        variete_id: selectedVariete,
        quantite: parseFloat(quantite),
        prix: parseFloat(prix),
      };

      const { error: supabaseError } = await supabaseHelper.addAchat(achat);

      if (supabaseError) {
        if (supabaseError.message.includes('connecté')) {
          setError('Vous devez être connecté pour enregistrer un achat');
        } else {
          throw supabaseError;
        }
        return;
      }

      setSuccess('✅ Achat enregistré avec succès !');
      setSelectedVariete('');
      setQuantite('');
      setPrix('');

      if (onAchatComplete) {
        onAchatComplete();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement de l'achat");
      log.error("Erreur lors de l'ajout de la variété:", {
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <Title>Nouvel Achat</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Variété</Label>
            <Select
              value={selectedVariete}
              onChange={e => setSelectedVariete(e.target.value)}
            >
              <option value="">Sélectionnez une variété</option>
              {varietes.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nom} ({v.type}){v.origine ? ` - ${v.origine}` : ''}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Quantité (g)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={quantite}
              onChange={e => setQuantite(e.target.value)}
              placeholder="Entrez la quantité en grammes"
            />
          </FormGroup>

          <FormGroup>
            <Label>Prix (€)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={prix}
              onChange={e => setPrix(e.target.value)}
              placeholder="Entrez le prix en euros"
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : "Enregistrer l'achat"}
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
