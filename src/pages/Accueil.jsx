import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import AsteroidBackground from '../components/AsteroidBackground.jsx';

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background: #111;

  @media (max-width: 768px) {
    padding: 0.5rem;
    height: 100dvh;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.img`
  width: 80%;
  max-width: 300px;
  height: auto;
  margin: 2rem 0;

  @media (max-width: 768px) {
    width: 70%;
    margin: 1.5rem 0;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    max-width: 300px;
    gap: 0.8rem;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid #00ff88;
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    min-width: unset;
  }

  &:hover {
    background: rgba(0, 255, 136, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <AsteroidBackground />

      <ContentWrapper>
        <Title>Analysticks</Title>
        <Logo src="/logo-analysticks.png" alt="Logo" />

        <ButtonContainer>
          <NavButton onClick={() => navigate('/stats')}>
            <ArrowLeft size={20} />
            Statistiques
          </NavButton>

          <NavButton onClick={() => navigate('/formulaire')}>
            Formulaire
            <ArrowRight size={20} />
          </NavButton>
        </ButtonContainer>
      </ContentWrapper>
    </MobileContainer>
  );
}
