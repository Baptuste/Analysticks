import React, { useEffect, useState } from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ScatterChart, Scatter, AreaChart, Area, Cell, CartesianGrid,
  LineChart, Line
} from 'recharts';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import styles from './Statistiques.module.css';
import { supabaseHelper } from '../lib/supabase';
import styled from 'styled-components';
import AchatsStats from '../components/AchatsStats.jsx';

// Initialisation des particules pour l'effet visuel
const particlesInit = async (main) => {
  await loadSlim(main);
};

// Paramétrage des particules
const particlesOptions = {
  fullScreen: { enable: true, zIndex: 0 },
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 80 },
    color: { value: ["#00ffcc", "#00ffaa", "#88ffee"] },
    shape: { type: "circle" },
    opacity: {
      value: 0.7,
      anim: { enable: true, speed: 0.3, opacity_min: 0.3, sync: false }
    },
    size: {
      value: 2.5,
      random: true,
      anim: { enable: true, speed: 1.5, size_min: 0.5, sync: false }
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      outModes: { default: "bounce" }
    },
    twinkle: {
      particles: {
        enable: true,
        color: "#00ffcc",
        frequency: 0.1,
        opacity: 1
      }
    }
  }
};

const KPIContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem auto;
  max-width: 1200px;
  width: calc(100% - 2rem);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin: 0.8rem;
    width: calc(100% - 1.6rem);
  }
`;

const KPICard = styled.div`
  background: #222;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #00ff88;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  height: 100%;
  min-height: 200px;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 160px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const KPIHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const KPIIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  border-radius: 8px;
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const KPIContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const KPILabel = styled.div`
  color: #fff;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const KPIValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ff88;
  margin: 0.5rem 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin: 0.3rem 0;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  margin: 0.5rem;
  min-height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin: 0.25rem;
    min-height: 80px;
    
    .recharts-legend-wrapper {
      position: relative !important;
      width: 100% !important;
      height: auto !important;
      left: 0 !important;
      bottom: -10px !important;
      display: flex;
      justify-content: center;
      
      .recharts-default-legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        padding: 4px;
        
        .recharts-legend-item {
          margin: 0 !important;
          padding: 2px 4px !important;
          font-size: 0.7rem !important;
        }
      }
    }
  }

  .recharts-wrapper {
    position: relative;
    width: 100% !important;
  }

  .recharts-text {
    @media (max-width: 768px) {
      font-size: 0.7rem !important;
    }
  }

  .recharts-cartesian-axis-tick-value {
    @media (max-width: 768px) {
      font-size: 0.65rem;
    }
  }
  
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: rgba(255, 255, 255, 0.1);
  }
  
  .recharts-cartesian-axis-line {
    stroke: rgba(255, 255, 255, 0.2);
  }
`;

// Palette de couleurs pour les graphiques
const CHART_COLORS = {
  primary: '#00ff88',
  secondary: '#00ccff',
  accent1: '#ff3366',
  accent2: '#ffcc00',
  accent3: '#9966ff',
  accent4: '#ff9933',
  background: 'rgba(0, 255, 136, 0.1)'
};

const CHART_GRADIENTS = {
  primary: [
    { offset: '0%', color: 'rgba(0, 255, 136, 0.6)' },
    { offset: '100%', color: 'rgba(0, 255, 136, 0.1)' }
  ],
  secondary: [
    { offset: '0%', color: 'rgba(0, 204, 255, 0.6)' },
    { offset: '100%', color: 'rgba(0, 204, 255, 0.1)' }
  ]
};

// Palette de couleurs pour les éléments
const ELEMENT_COLORS = {
  types: {
    'Beuh': '#4CAF50',
    'Mousseux': '#2196F3',
    'Dry': '#9C27B0',
    'Frozen': '#00BCD4',
    'Static': '#FF9800',
    'Autres': '#607D8B'
  },
  repartitions: {
    'Pure': '#E91E63',
    '10/90': '#F44336',
    '20/80': '#FF5722',
    '30/70': '#FF9800',
    '40/60': '#FFC107',
    '50/50': '#FFEB3B',
    '60/40': '#8BC34A',
    '70/30': '#4CAF50',
    'Mixte': '#009688'
  },
  longueurs: {
    'Petit': '#3F51B5',
    'Moyen -': '#2196F3',
    'Moyen': '#03A9F4',
    'Moyen +': '#00BCD4',
    'Long': '#009688'
  },
  largeurs: {
    'Skinny': '#9C27B0',
    'Normal -': '#E91E63',
    'Normal': '#F44336',
    'Normal +': '#FF5722',
    'Bien': '#FF9800'
  }
};

const CustomTooltip = styled.div`
  background: rgba(17, 17, 17, 0.95);
  border: 1px solid ${CHART_COLORS.primary};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  max-width: 90vw;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.8rem;
    max-width: 200px;
    
    .tooltip-title {
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tooltip-content {
      font-size: 0.8rem;
    }
  }

  .tooltip-title {
    color: ${CHART_COLORS.primary};
    font-weight: bold;
    margin-bottom: 8px;
  }

  .tooltip-content {
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

// Composant de tooltip personnalisé pour les graphiques
const renderCustomTooltip = ({ active, payload, label, type }) => {
  if (!active || !payload || !payload.length) return null;

  let title = '';
  let content = null;

  switch (type) {
    case 'types':
      title = 'Type de variété';
      content = (
        <>
          <div className="tooltip-label">
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'repartition':
      title = 'Répartition';
      content = (
        <>
          <div className="tooltip-label">
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'longueur':
      title = 'Longueur';
      content = (
        <>
          <div className="tooltip-label">
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'largeur':
      title = 'Largeur';
      content = (
        <>
          <div className="tooltip-label">
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'weekly':
      title = payload[0].payload.fullDate || label;
      content = (
        <>
          <div>Nombre de sticks : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    default:
      title = label;
      content = (
        <>
          <div>Quantité : {payload[0].value}</div>
        </>
      );
  }

  return (
    <CustomTooltip>
      <div className="tooltip-title">{title}</div>
      <div className="tooltip-content">{content}</div>
    </CustomTooltip>
  );
};

export default function Statistiques() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weeklyData, setWeeklyData] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [repartitionData, setRepartitionData] = useState([]);
  const [longueursData, setLongueursData] = useState([]);
  const [largeursData, setLargeursData] = useState([]);
  const [kpis, setKpis] = useState({
    total: 0,
    moyenneHebdo: 0,
    tendance: 0,
    typePopulaire: '',
    repartitionPopulaire: '',
    varietePopulaire: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entries = await supabaseHelper.getAllEntries();
        
        // Grouper les données par jour
        const dailyConsumption = entries.reduce((acc, entry) => {
          const date = new Date(entry.timestamp);
          const monthName = new Intl.DateTimeFormat('fr-FR', { 
            month: 'long'
          }).format(date);
          const dayLabel = `${date.getDate()} ${monthName}`;
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Clé unique pour chaque mois
          
          if (!acc[dayLabel]) {
            acc[dayLabel] = {
              day: dayLabel,
              count: 0,
              x: monthName.charAt(0).toUpperCase() + monthName.slice(1),
              y: 0,
              timestamp: date,
              monthKey
            };
          }
          
          acc[dayLabel].count += 1;
          acc[dayLabel].y = acc[dayLabel].count;
          
          return acc;
        }, {});

        const processedDailyData = Object.values(dailyConsumption)
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item, index, array) => {
            const isFirstOfMonth = index === 0 || 
              item.monthKey !== array[index - 1].monthKey;
            
            return { 
              x: isFirstOfMonth ? item.x : '',
              y: item.y,
              value: item.count,
              fullDate: item.day,
              monthKey: item.monthKey
            };
          });

        // Traitement des données par type
        const typeCount = entries.reduce((acc, entry) => {
          const type = entry.variete?.type || 'Inconnu';
          if (!acc[type]) {
            acc[type] = { type, count: 0 };
          }
          acc[type].count += 1;
          return acc;
        }, {});

        const processedTypesData = Object.values(typeCount)
          .sort((a, b) => b.count - a.count)
          .map(item => ({ 
            name: item.type,
            value: item.count
          }));

        // Traitement des données par répartition
        const repartitionCount = entries.reduce((acc, entry) => {
          if (!acc[entry.repartition]) {
            acc[entry.repartition] = { name: entry.repartition, count: 0 };
          }
          acc[entry.repartition].count += 1;
          return acc;
        }, {});

        const processedRepartitionData = Object.values(repartitionCount)
          .sort((a, b) => b.count - a.count)
          .map(item => ({
            name: item.name,
            value: item.count
          }));

        // Traitement des données par longueur
        const longueurCount = entries.reduce((acc, entry) => {
          if (!acc[entry.longueur]) {
            acc[entry.longueur] = { name: entry.longueur, count: 0 };
          }
          acc[entry.longueur].count += 1;
          return acc;
        }, {});

        const processedLongueursData = Object.values(longueurCount)
          .sort((a, b) => b.count - a.count)
          .map(item => ({
            name: item.name,
            value: item.count
          }));

        // Traitement des données par largeur
        const largeurCount = entries.reduce((acc, entry) => {
          if (!acc[entry.largeur]) {
            acc[entry.largeur] = { name: entry.largeur, count: 0 };
          }
          acc[entry.largeur].count += 1;
          return acc;
        }, {});

        const processedLargeursData = Object.values(largeurCount)
          .sort((a, b) => b.count - a.count)
          .map(item => ({
            name: item.name,
            value: item.count
          }));

        // Mise à jour des états
        setWeeklyData(processedDailyData);
        setTypesData(processedTypesData);
        setRepartitionData(processedRepartitionData);
        setLongueursData(processedLongueursData);
        setLargeursData(processedLargeursData);

        // Calcul des KPIs
        const total = entries.length;
        const moyenneHebdo = Math.round(total / processedDailyData.length);
        const derniereSemaine = processedDailyData[processedDailyData.length - 1]?.y || 0;
        const semainePrecedente = processedDailyData[processedDailyData.length - 2]?.y || 0;
        const tendance = semainePrecedente ? Math.round(((derniereSemaine - semainePrecedente) / semainePrecedente) * 100) : 0;

        setKpis({
          total,
          moyenneHebdo,
          tendance,
          typePopulaire: processedTypesData[0]?.name || 'Inconnu',
          repartitionPopulaire: processedRepartitionData[0]?.name || 'Inconnue'
        });

        setError('');
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className={styles.container}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#00ff88'
      }}>
        Chargement des statistiques...
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#ff5555'
      }}>
        Erreur : {error}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />

      <button className={styles.homeButton} onClick={() => navigate('/')} aria-label="Retour à l'accueil">
        <Home size={24} color="#00ff88" />
      </button>

      <h1 className={styles.mainTitle}>Statistiques</h1>

      <KPIContainer>
        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <ArrowUp size={20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Total des sticks</KPILabel>
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <KPIValue>{kpis.total}</KPIValue>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#fff', 
                  opacity: 0.8 
                }}>
                  Total
                </div>
              </div>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart 
                data={weeklyData.slice(-30)} 
                margin={{
                  top: 5, 
                  right: window.innerWidth <= 768 ? 5 : 10, 
                  bottom: 5, 
                  left: window.innerWidth <= 768 ? 5 : 10 
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  content={(props) => renderCustomTooltip({ ...props, type: 'weekly' })}
                  cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="none"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={window.innerWidth <= 768 ? 1.5 : 2}
                  dot={{ 
                    fill: CHART_COLORS.primary, 
                    r: window.innerWidth <= 768 ? 2 : 3,
                    strokeWidth: 1,
                    stroke: '#fff'
                  }}
                  activeDot={{
                    r: window.innerWidth <= 768 ? 4 : 6,
                    fill: CHART_COLORS.secondary,
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
            color: '#fff',
            opacity: 0.8,
            padding: '0 0.5rem',
            marginTop: '0.5rem'
          }}>
            <div>
              Max: {Math.max(...weeklyData.slice(-30).map(d => d.y))}
            </div>
            <div>
              Moy: {Math.round(weeklyData.slice(-30).reduce((acc, curr) => acc + curr.y, 0) / Math.min(30, weeklyData.slice(-30).length))}
            </div>
          </div>
        </KPICard>

        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <Home size={window.innerWidth <= 768 ? 16 : 20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Types de variétés</KPILabel>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: window.innerWidth <= 768 ? 20 : 0, left: 0 }}>
                <Pie
                  data={typesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? "45%" : "50%"}
                  outerRadius={window.innerWidth <= 768 ? "70%" : "80%"}
                  paddingAngle={2}
                  label={window.innerWidth <= 768 ? false : true}
                >
                  {typesData.map((entry, index) => (
                    <Cell key={index} fill={ELEMENT_COLORS.types[entry.name] || CHART_COLORS.accent4} />
                  ))}
                </Pie>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'types' })} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </KPICard>

        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <ArrowUp size={20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Répartition favorite</KPILabel>
              <KPIValue>{kpis.repartitionPopulaire}</KPIValue>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'repartition' })} />
                <Pie
                  data={repartitionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={30}
                >
                  {repartitionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={ELEMENT_COLORS.repartitions[entry.name] || CHART_COLORS.accent2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </KPICard>

        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <ArrowUp size={20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Dimensions</KPILabel>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
                marginTop: window.innerWidth <= 768 ? '0.3rem' : '0.5rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem', opacity: 0.8 }}>Longueur</div>
                  <KPIValue style={{ fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem' }}>{longueursData[0]?.name || '-'}</KPIValue>
                </div>
                <div>
                  <div style={{ fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem', opacity: 0.8 }}>Largeur</div>
                  <KPIValue style={{ fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem' }}>{largeursData[0]?.name || '-'}</KPIValue>
                </div>
              </div>
            </KPIContent>
          </KPIHeader>
          <ChartContainer style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: window.innerWidth <= 768 ? '0.5rem' : '1rem'
          }}>
            <ResponsiveContainer width="48%" height={window.innerWidth <= 768 ? 60 : 80}>
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'longueur' })} />
                <Pie
                  data={longueursData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? 12 : 15}
                  outerRadius={window.innerWidth <= 768 ? 24 : 30}
                >
                  {longueursData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={ELEMENT_COLORS.longueurs[entry.name] || CHART_COLORS.accent3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="48%" height={window.innerWidth <= 768 ? 60 : 80}>
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'largeur' })} />
                <Pie
                  data={largeursData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? 12 : 15}
                  outerRadius={window.innerWidth <= 768 ? 24 : 30}
                >
                  {largeursData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={ELEMENT_COLORS.largeurs[entry.name] || CHART_COLORS.accent4}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
            color: '#fff',
            opacity: 0.8,
            padding: '0 1rem',
            marginTop: window.innerWidth <= 768 ? '0.3rem' : '0.5rem'
          }}>
            <div>Longueur</div>
            <div>Largeur</div>
          </div>
        </KPICard>
      </KPIContainer>

      <AchatsStats />
    </div>
  );
}
