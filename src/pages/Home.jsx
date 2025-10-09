import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PlusCircle, BarChart } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #111;
  color: #fff;
  padding: 2rem;
`;

const Logo = styled.img`
  max-width: 200px;
  margin-bottom: 2rem;
  filter: drop-shadow(0 0 10px #00ff88);
`;

const Title = styled.h1`
  color: #00ff88;
  text-align: center;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px solid #00ff88;
  color: #00ff88;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00ff88;
    color: #000;
  }
`;

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo src="/logo-analysticks.png" alt="Logo Analysticks" />
      <Title>Analysticks</Title>
      <ButtonContainer>
        <Button onClick={() => navigate('/formulaire')}>
          <PlusCircle size={24} />
          Nouvelle entrée
        </Button>
        <Button onClick={() => navigate('/stats')}>
          <BarChart size={24} />
          Statistiques
        </Button>
      </ButtonContainer>
    </Container>
  );
}
