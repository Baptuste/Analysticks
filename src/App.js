import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import LoadingBattery from './components/LoadingBattery';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #111;
`;

function App() {
  return (
    <div className="App">
      <Suspense fallback={
        <LoadingContainer>
          <LoadingBattery />
        </LoadingContainer>
      }>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
