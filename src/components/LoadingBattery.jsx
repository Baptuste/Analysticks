import React from 'react';
import styled, { keyframes } from 'styled-components';

const fillAnimation = keyframes`
  0% {
    width: 0%;
    background: #ff3366;
  }
  50% {
    background: #ffcc00;
  }
  100% {
    width: 100%;
    background: #00ff88;
  }
`;

const BatteryContainer = styled.div`
  width: 200px;
  height: 100px;
  border: 3px solid #00ff88;
  border-radius: 15px;
  position: relative;
  margin: 20px auto;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 40px;
    background: #00ff88;
    border-radius: 0 5px 5px 0;
  }
`;

const BatteryLevel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: #00ff88;
  animation: ${fillAnimation} 2s ease-in-out forwards;
`;

const LoadingBattery = () => {
  return (
    <BatteryContainer>
      <BatteryLevel />
    </BatteryContainer>
  );
};

export default LoadingBattery; 