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
import AchatsStats from '../components/AchatsStats';

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

const WeeklyConsumptionContainer = styled.div`
  background: #222;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem auto;
  border: 1px solid #00ff88;
  height: 400px;
  width: calc(100% - 2rem);
  max-width: 1200px;

  @media (max-width: 768px) {
    margin: 0.5rem;
    height: 350px;
    width: calc(100% - 1rem);
    padding: 0.75rem;

    h2 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
  }
`;

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
    grid-template-rows: repeat(4, auto);
    gap: 0.5rem;
    margin: 0.5rem;
    width: calc(100% - 1rem);
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
    min-height: 170px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const KPIHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
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

const KPIValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ff88;
  margin: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
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

const ChartContainer = styled.div`
  flex: 1;
  margin: 0.5rem;
  min-height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .recharts-wrapper {
    position: relative;
    width: 100% !important;
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

// Palette de couleurs étendue pour les éléments des graphiques
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

// Palette de couleurs étendue pour les variétés individuelles
const VARIETE_COLORS = [
  '#FF6B6B', // Rouge corail
  '#4ECDC4', // Turquoise
  '#45B7D1', // Bleu ciel
  '#96CEB4', // Vert menthe
  '#FFEEAD', // Jaune pâle
  '#D4A5A5', // Rose poudré
  '#9A8194', // Violet pâle
  '#392F5A', // Violet foncé
  '#31A9B8', // Bleu-vert
  '#FF9F1C', // Orange
  '#2EC4B6', // Turquoise vif
  '#E71D36', // Rouge vif
  '#FF9F1C', // Orange doré
  '#8093F1', // Bleu lavande
  '#72DDF7', // Bleu clair
];

const CustomTooltip = styled.div`
  background: rgba(17, 17, 17, 0.95);
  border: 1px solid ${CHART_COLORS.primary};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);

  .tooltip-title {
    color: ${CHART_COLORS.primary};
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .tooltip-content {
    color: #fff;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tooltip-value {
    color: ${CHART_COLORS.secondary};
    font-weight: bold;
  }

  .tooltip-label {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }
`;

// Composant de tooltip personnalisé pour les graphiques
const renderCustomTooltip = ({ active, payload, label, type }, varietesData = []) => {
  if (!active || !payload || !payload.length) return null;

  let title = '';
  let content = null;

  switch (type) {
    case 'types':
      title = 'Type de variété';
      content = (
        <>
          <div className="tooltip-label">
            <span 
              className="color-dot" 
              style={{ background: ELEMENT_COLORS.types[payload[0].payload.name] || CHART_COLORS.accent1 }} 
            />
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
            <span 
              className="color-dot" 
              style={{ background: ELEMENT_COLORS.repartitions[payload[0].payload.name] || CHART_COLORS.accent2 }} 
            />
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'varietes':
      const index = varietesData.findIndex(v => v.name === payload[0].payload.name);
      title = 'Variété';
      content = (
        <>
          <div className="tooltip-label">
            <span 
              className="color-dot" 
              style={{ background: VARIETE_COLORS[index % VARIETE_COLORS.length] }}
            />
            <span>{payload[0].payload.name}</span>
          </div>
          <div>Type : <span className="tooltip-value">{payload[0].payload.type}</span></div>
          <div>Quantité : <span className="tooltip-value">{payload[0].value}</span></div>
        </>
      );
      break;

    case 'weekly':
      title = payload[0].payload.fullDate;
      content = (
        <>
          <div>Nombre de sticks : <span className="tooltip-value">{payload[0].payload.y}</span></div>
        </>
      );
      break;

    default:
      return null;
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
  const [varietesData, setVarietesData] = useState([]);
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
        
        // Grouper les données par jour mais afficher uniquement le mois
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
              monthKey // Ajout de la clé du mois
            };
          }
          
          acc[dayLabel].count += 1;
          acc[dayLabel].y = acc[dayLabel].count;
          
          return acc;
        }, {});

        const processedDailyData = Object.values(dailyConsumption)
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item, index, array) => {
            // Vérifier si c'est la première occurrence du mois
            const isFirstOfMonth = index === 0 || 
              item.monthKey !== array[index - 1].monthKey;
            
            return { 
              x: isFirstOfMonth ? item.x : '',  // N'afficher le mois que pour la première occurrence
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
          .map((item, index) => ({ 
            index, 
            value: item.count,
            name: item.type 
          }))
          .slice(0, 5);

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
          .map((item, index) => ({
            index,
            value: item.count,
            name: item.name
          }));

        // Traitement des données par variété
        const varieteCount = entries.reduce((acc, entry) => {
          const nom = entry.variete?.nom || 'Inconnue';
          if (!acc[nom]) {
            acc[nom] = { name: nom, count: 0 };
          }
          acc[nom].count += 1;
          return acc;
        }, {});

        const processedVarietesData = Object.values(varieteCount)
          .sort((a, b) => b.count - a.count)
          .map((item, index) => ({
            index,
            value: item.count,
            name: item.name
          }))
          .slice(0, 5);

        // Mise à jour des états
        setWeeklyData(processedDailyData);
        setTypesData(processedTypesData);
        setRepartitionData(processedRepartitionData);
        setVarietesData(processedVarietesData);

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
          repartitionPopulaire: processedRepartitionData[0]?.name || 'Inconnue',
          varietePopulaire: processedVarietesData[0]?.name || 'Inconnue'
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

  if (loading) return <div className={styles.container}>Chargement des statistiques...</div>;
  if (error) return <div className={styles.container}>Erreur : {error}</div>;

  return (
    <div className={styles.container}>
      <Particles id="stars" init={particlesInit} options={particlesOptions} className={styles.particles} />

      <button className={styles.homeButton} onClick={() => navigate('/')} aria-label="Retour à l'accueil">
        <Home size={28} color="#00ff88" />
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
              <KPIValue>{kpis.total}</KPIValue>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart 
                data={weeklyData} 
                margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
              >
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    {CHART_GRADIENTS.primary.map((stop, index) => (
                      <stop key={index} offset={stop.offset} stopColor={stop.color} />
                    ))}
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="x"
                  tick={{ fill: '#fff', fontSize: 10, angle: -45, textAnchor: 'end' }}
                  height={40}
                  interval={1}
                />
                <YAxis 
                  tick={{ fill: '#fff', fontSize: 10 }}
                  width={25}
                />
                <Tooltip 
                  content={(props) => renderCustomTooltip({ ...props, type: 'weekly' }, varietesData)}
                />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke={CHART_COLORS.primary}
                  fill="url(#gradientPrimary)"
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary, r: 3 }}
                  activeDot={{ r: 5, fill: CHART_COLORS.secondary }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </KPICard>

        <KPICard>
          <KPIHeader>
            <KPIIcon>
              <ArrowUp size={20} />
            </KPIIcon>
            <KPIContent>
              <KPILabel>Type le plus utilisé</KPILabel>
              <KPIValue>{kpis.typePopulaire}</KPIValue>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={typesData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'types' }, varietesData)} />
                <Bar 
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                >
                  {typesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ELEMENT_COLORS.types[entry.name] || CHART_COLORS.accent1}
                    />
                  ))}
                </Bar>
              </BarChart>
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
            <ResponsiveContainer width="100%" height={100}>
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'repartition' }, varietesData)} />
                <Pie
                  data={repartitionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="80%"
                  paddingAngle={2}
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
              <KPILabel>Variété préférée</KPILabel>
              <KPIValue>{kpis.varietePopulaire}</KPIValue>
            </KPIContent>
          </KPIHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart 
                data={varietesData.slice(0, 3)} 
                layout="vertical" 
                margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip content={(props) => renderCustomTooltip({ ...props, type: 'varietes' }, varietesData)} />
                <Bar 
                  dataKey="value"
                  maxBarSize={20}
                  radius={[0, 4, 4, 0]}
                >
                  {varietesData.slice(0, 3).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={VARIETE_COLORS[index % VARIETE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </KPICard>
      </KPIContainer>

      <WeeklyConsumptionContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: CHART_COLORS.primary }}>Évolution de la Consommation</h2>
          <div style={{ display: 'flex', gap: '2rem', color: '#fff' }}>
            <div>
              <span style={{ color: CHART_COLORS.primary }}>Maximum : </span>
              {Math.max(...weeklyData.map(d => d.y))} sticks
            </div>
            <div>
              <span style={{ color: CHART_COLORS.primary }}>Moyenne : </span>
              {Math.round(weeklyData.reduce((acc, curr) => acc + curr.y, 0) / weeklyData.length)} sticks
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 30,
              bottom: 60,
              left: 30
            }}
          >
            <defs>
              <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="x"
              tick={{ fill: '#fff', angle: 0, textAnchor: 'middle' }}
              height={40}
              interval={0}
              padding={{ left: 30, right: 30 }}
              label={{
                value: 'Mois',
                position: 'bottom',
                fill: '#fff',
                offset: 20
              }}
            />
            <YAxis
              tick={{ fill: '#fff' }}
              label={{
                value: 'Nombre de sticks',
                angle: -90,
                position: 'insideLeft',
                fill: '#fff',
                offset: 10
              }}
              domain={[0, 'dataMax + 2']}
              allowDataOverflow={false}
            />
            <Tooltip
              content={(props) => renderCustomTooltip({ ...props, type: 'weekly' }, varietesData)}
              cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorQuantity)"
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary, r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{
                r: 8,
                fill: CHART_COLORS.secondary,
                stroke: '#fff',
                strokeWidth: 2
              }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </WeeklyConsumptionContainer>

      <AchatsStats />
    </div>
  );
}
