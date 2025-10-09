import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { log } from '../utils/logger';

const LogContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #fff;
  z-index: 1000;
  overflow-y: auto;
  display: ${props => (props.visible ? 'block' : 'none')};
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
`;

const LogTitle = styled.h4`
  margin: 0;
  color: #00ff88;
  font-size: 14px;
`;

const ToggleButton = styled.button`
  background: none;
  border: 1px solid #00ff88;
  color: #00ff88;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #00ff88;
    color: #000;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid #ff3366;
  color: #ff3366;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 0.5rem;

  &:hover {
    background: #ff3366;
    color: #fff;
  }
`;

const LogEntry = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.4;

  &.error {
    background: rgba(255, 51, 102, 0.1);
    border-left: 3px solid #ff3366;
  }

  &.warn {
    background: rgba(255, 204, 0, 0.1);
    border-left: 3px solid #ffcc00;
  }

  &.info {
    background: rgba(0, 204, 255, 0.1);
    border-left: 3px solid #00ccff;
  }

  &.debug {
    background: rgba(0, 255, 136, 0.1);
    border-left: 3px solid #00ff88;
  }
`;

const LogTime = styled.span`
  color: #666;
  font-size: 10px;
`;

const LogMessage = styled.div`
  margin-top: 0.25rem;
  word-break: break-all;
`;

const LogContext = styled.div`
  margin-top: 0.25rem;
  color: #999;
  font-size: 10px;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #00ff88;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 2px 10px rgba(0, 255, 136, 0.3);
  display: ${props => (props.visible ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  z-index: 1001;

  &:hover {
    background: #00cc6a;
    transform: scale(1.1);
  }
`;

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Récupérer les logs stockés
  const refreshLogs = () => {
    const storedLogs = log.getLogs();
    setLogs(storedLogs.reverse()); // Plus récents en premier
  };

  useEffect(() => {
    refreshLogs();

    if (autoRefresh) {
      const interval = setInterval(refreshLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const clearLogs = () => {
    log.clearLogs();
    setLogs([]);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      <FloatingButton visible={visible} onClick={toggleVisibility}>
        📊
      </FloatingButton>

      <LogContainer visible={visible}>
        <LogHeader>
          <LogTitle>Logs de l&apos;Application</LogTitle>
          <div>
            <ToggleButton onClick={toggleVisibility}>
              {visible ? 'Masquer' : 'Afficher'}
            </ToggleButton>
            <ClearButton onClick={clearLogs}>Effacer</ClearButton>
          </div>
        </LogHeader>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', color: '#ccc' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Actualisation automatique
          </label>
        </div>

        <div>
          {logs.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              Aucun log disponible
            </div>
          ) : (
            logs.map((logEntry, index) => (
              <LogEntry key={index} className={logEntry.level.toLowerCase()}>
                <LogTime>
                  {new Date(logEntry.timestamp).toLocaleTimeString()}
                </LogTime>
                <LogMessage>{logEntry.message}</LogMessage>
                {logEntry.context && (
                  <LogContext>Contexte: {logEntry.context}</LogContext>
                )}
              </LogEntry>
            ))
          )}
        </div>
      </LogContainer>
    </>
  );
}
