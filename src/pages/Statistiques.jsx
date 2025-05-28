import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Hash, 
  Leaf, 
  PieChart as PieChartIcon,
  Ruler,
  ArrowUp
} from 'lucide-react';
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
  gap: 1rem;
  margin: 1rem auto;
  max-width: 1200px;
  width: calc(100% - 2rem);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin: 0.5rem;
    width: calc(100% - 1rem);
  }
`;

// Conteneur spécial pour les statistiques d'achat
const AchatsContainer = styled.div`
  grid-column: 1 / -1;  // Prend toute la largeur
  margin-top: 1rem;
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
    padding: 0.75rem;
    min-height: 140px;
    font-size: 0.9rem;
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
    margin-bottom: 0.5rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
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
    width: 28px;
    height: 28px;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const KPIContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const KPILabel = styled.div`
  color: #fff;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    text-align: center;
  }
`;

const KPIValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ff88;
  margin: 0.5rem 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin: 0.2rem 0;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 250px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 0.25rem;
  }

  .recharts-wrapper {
    width: 100% !important;
    height: 100% !important;
  }
`;

// Palette de couleurs pour les graphiques
const CHART_COLORS = {
  primary: '#00E676',       // Vert vif principal
  secondary: '#00B0FF',     // Bleu clair secondaire
  accent1: '#FF4081',       // Rose accent
  accent2: '#FFD740',       // Jaune doré accent
  accent3: '#651FFF',       // Violet accent
  accent4: '#FF6D00',       // Orange accent
  background: 'rgba(0, 230, 118, 0.1)' // Fond vert transparent
};

const CHART_GRADIENTS = {
  primary: [
    { offset: '0%', color: 'rgba(0, 230, 118, 0.6)' },  // Vert plus vif
    { offset: '100%', color: 'rgba(0, 230, 118, 0.1)' }
  ],
  secondary: [
    { offset: '0%', color: 'rgba(0, 176, 255, 0.6)' },  // Bleu plus vif
    { offset: '100%', color: 'rgba(0, 176, 255, 0.1)' }
  ]
};

// Palette de couleurs pour les éléments
const ELEMENT_COLORS = {
  types: {
    'Beuh': '#00E676',      // Vert vif
    'Mousseux': '#00B0FF',  // Bleu clair vif
    'Dry': '#FF4081',       // Rose vif
    'Frozen': '#40C4FF',    // Bleu ciel
    'Static': '#FFD740',    // Jaune doré
    'Autres': '#78909C'     // Gris bleuté
  },
  repartitions: {
    'Pure': '#FF1744',      // Rouge vif
    '10/90': '#FF4081',     // Rose
    '20/80': '#F50057',     // Rose foncé
    '30/70': '#D500F9',     // Violet
    '40/60': '#651FFF',     // Violet foncé
    '50/50': '#3D5AFE',     // Bleu indigo
    '60/40': '#2979FF',     // Bleu vif
    '70/30': '#00B0FF',     // Bleu clair
    'Mixte': '#00E5FF'      // Cyan
  },
  longueurs: {
    'Petit': '#FF6B6B',     // Rouge corail
    'Moyen -': '#4ECDC4',   // Turquoise vif
    'Moyen': '#FFD93D',     // Jaune soleil
    'Moyen +': '#6C5CE7',   // Violet électrique
    'Long': '#A8E6CF'       // Vert menthe
  },
  largeurs: {
    'Skinny': '#FF8066',    // Corail vif
    'Normal -': '#45B7D1',  // Bleu océan
    'Normal': '#96E6A1',    // Vert prairie
    'Normal +': '#D4A5FF',  // Violet lavande
    'Bien': '#FFB480'       // Orange pêche
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

const ComparaisonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 255, 136, 0.05);
  border-radius: 8px;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.25rem;
    font-size: 0.8rem;
  }
`;

const ComparaisonItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.25rem;
  }
`;

const ComparaisonLabel = styled.div`
  color: #fff;
  opacity: 0.8;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ComparaisonValue = styled.div`
  color: ${props => props.$isPositive ? '#00ff88' : '#ff3366'};
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const calculerComparaison = (donnees, jours) => {
  if (!donnees || donnees.length === 0) return { valeur: 0, variation: 0 };
  
  const maintenant = donnees[donnees.length - 1]?.y || 0;
  const precedent = donnees[donnees.length - 1 - jours]?.y || 0;
  
  const variation = precedent !== 0 ? ((maintenant - precedent) / precedent) * 100 : 0;
  
  return {
    valeur: maintenant,
    variation: Math.round(variation)
  };
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
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className={styles.particles} />
      <button className={styles.homeButton} onClick={() => navigate('/')}>
        <Home size={24} color="#00ffcc" />
      </button>
      <h1 className={styles.mainTitle}>Statistiques</h1>

      <KPIContainer>
        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <Hash size={window.innerWidth <= 768 ? 16 : 20} />
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
          <ComparaisonContainer>
            <ComparaisonItem>
              <ComparaisonLabel>vs Semaine dernière</ComparaisonLabel>
              <ComparaisonValue $isPositive={calculerComparaison(weeklyData, 7).variation >= 0}>
                {calculerComparaison(weeklyData, 7).variation > 0 ? '+' : ''}
                {calculerComparaison(weeklyData, 7).variation}%
              </ComparaisonValue>
            </ComparaisonItem>
            <ComparaisonItem>
              <ComparaisonLabel>vs Mois dernier</ComparaisonLabel>
              <ComparaisonValue $isPositive={calculerComparaison(weeklyData, 30).variation >= 0}>
                {calculerComparaison(weeklyData, 30).variation > 0 ? '+' : ''}
                {calculerComparaison(weeklyData, 30).variation}%
              </ComparaisonValue>
            </ComparaisonItem>
          </ComparaisonContainer>
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
              <Leaf size={window.innerWidth <= 768 ? 16 : 20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Types de variétés</KPILabel>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: window.innerWidth <= 768 ? 10 : 0, left: 0 }}>
                <Pie
                  data={typesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? "30%" : "40%"}
                  outerRadius={window.innerWidth <= 768 ? "85%" : "90%"}
                  paddingAngle={window.innerWidth <= 768 ? 1 : 2}
                  label={window.innerWidth <= 768 ? false : {
                    position: 'outside',
                    fill: '#fff',
                    fontSize: 12
                  }}
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
              <PieChartIcon size={window.innerWidth <= 768 ? 16 : 20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Répartition favorite</KPILabel>
              <KPIValue>{kpis.repartitionPopulaire}</KPIValue>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'repartition' })} />
                <Pie
                  data={repartitionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? "35%" : "45%"}
                  outerRadius={window.innerWidth <= 768 ? "75%" : "85%"}
                  paddingAngle={2}
                  label={window.innerWidth <= 768 ? false : {
                    position: 'outside',
                    fill: '#fff',
                    fontSize: 12
                  }}
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
              <Ruler size={window.innerWidth <= 768 ? 16 : 20} />
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
            <ResponsiveContainer width="48%" height={window.innerWidth <= 768 ? 120 : 150}>
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'longueur' })} />
                <Pie
                  data={longueursData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? "35%" : "45%"}
                  outerRadius={window.innerWidth <= 768 ? "75%" : "85%"}
                  paddingAngle={2}
                  label={window.innerWidth <= 768 ? false : {
                    position: 'outside',
                    fill: '#fff',
                    fontSize: 11
                  }}
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
            <ResponsiveContainer width="48%" height={window.innerWidth <= 768 ? 120 : 150}>
              <PieChart>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'largeur' })} />
                <Pie
                  data={largeursData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth <= 768 ? "35%" : "45%"}
                  outerRadius={window.innerWidth <= 768 ? "75%" : "85%"}
                  paddingAngle={2}
                  label={window.innerWidth <= 768 ? false : {
                    position: 'outside',
                    fill: '#fff',
                    fontSize: 11
                  }}
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

        {/* Statistiques d'achat sur toute la largeur */}
        <AchatsContainer>
          <AchatsStats />
        </AchatsContainer>
      </KPIContainer>
    </div>
  );
}
