import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { supabaseHelper } from '../lib/supabase';

const StatsContainer = styled.div`
  background: #222;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem auto;
  border: 1px solid #00ff88;
  width: calc(100% - 2rem);
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.5rem;
    width: calc(100% - 1rem);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  color: #00ff88;
  margin: 0;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-top: 1rem;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: rgba(0, 255, 136, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  color: #00ff88;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ChartSection = styled.div`
  margin: 2rem 0;
`;

const ChartTitle = styled.h3`
  color: #00ff88;
  margin-bottom: 1rem;
`;

const CustomTooltip = styled.div`
  background: rgba(17, 17, 17, 0.95);
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);

  .tooltip-title {
    color: #00ff88;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .tooltip-content {
    color: #fff;
    font-size: 0.9rem;
  }

  .tooltip-value {
    color: #00ccff;
    font-weight: bold;
  }
`;

const VarieteStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const VarieteCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.$color};
  border-radius: 10px;
  padding: 1.5rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`;

const VarieteHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const VarieteColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const VarieteName = styled.h3`
  color: ${props => props.$color};
  margin: 0;
  font-size: 1.2rem;
`;

const VarieteStatsList = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const VarieteStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VarieteItemLabel = styled.span`
  color: #fff;
  opacity: 0.8;
`;

const VarieteItemValue = styled.span`
  color: ${props => props.$color};
  font-weight: bold;
`;

const COLORS = {
  'Beuh du sage': {
    quantite: '#00ff88', // Vert vif
    prix: '#66ff99'
  },
  'Mousseux': {
    quantite: '#ff3366', // Rose vif
    prix: '#ff6699'
  },
  'Amnesia': {
    quantite: '#ffcc00', // Jaune doré
    prix: '#ffdd44'
  },
  'Lemon': {
    quantite: '#00ccff', // Bleu ciel
    prix: '#66ddff'
  },
  'Purple': {
    quantite: '#cc33ff', // Violet
    prix: '#dd66ff'
  },
  'Orange': {
    quantite: '#ff6600', // Orange
    prix: '#ff8833'
  }
};

const getVarieteColors = (variete) => {
  return COLORS[variete] || {
    quantite: '#ffffff',
    prix: '#cccccc'
  };
};

const CustomDot = ({ cx, cy, stroke, payload, value }) => {
  if (!value) return null;
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      stroke={stroke} 
      strokeWidth={2} 
      fill="#222"
      style={{ cursor: 'pointer' }}
    />
  );
};

const safeNumber = (value) => {
  try {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
};

const safeToFixed = (value, decimals = 2) => {
  try {
    const num = safeNumber(value);
    return Number(num.toFixed(decimals));
  } catch {
    return 0;
  }
};

const renderCustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  try {
    const quantite = safeNumber(payload[0]?.value);
    const prix = safeNumber(payload[1]?.value);

    return (
      <CustomTooltip>
        <div className="tooltip-title">{label || ''}</div>
        <div className="tooltip-content">
          <div>Quantité : <span className="tooltip-value">{safeToFixed(quantite)}g</span></div>
          <div>Prix : <span className="tooltip-value">{safeToFixed(prix)}€</span></div>
        </div>
      </CustomTooltip>
    );
  } catch (error) {
    console.error('Erreur dans le tooltip:', error);
    return null;
  }
};

export default function AchatsStats() {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processedData, setProcessedData] = useState([]);
  const [varieteStats, setVarieteStats] = useState({});
  const [stats, setStats] = useState({
    totalQuantite: 0,
    totalMontant: 0,
    prixMoyenParGramme: 0,
    dernierAchat: null,
    dernierAchatQuantite: 0,
    dernierAchatPrix: 0
  });

  const processAchatsData = useCallback(async () => {
    try {
      if (!Array.isArray(achats) || achats.length === 0) {
        console.log('Pas d\'achats à traiter');
        setProcessedData([]);
        setVarieteStats({});
        return;
      }

      // Nettoyage et validation des données
      const validAchats = achats.filter(achat => {
        if (!achat) return false;
        
        try {
          const date = new Date(achat.created_at);
          return (
            !isNaN(date.getTime()) && 
            achat.quantite !== undefined && 
            achat.prix !== undefined &&
            achat.varietes && 
            typeof achat.varietes.nom === 'string'
          );
        } catch (e) {
          console.error('Achat invalide:', e);
          return false;
        }
      });

      if (validAchats.length === 0) {
        console.log('Aucun achat valide trouvé');
        setProcessedData([]);
        setVarieteStats({});
        return;
      }

      // Préparation des données
      const achatsAvecDates = validAchats.map(achat => ({
        date: new Date(achat.created_at),
        quantite: safeNumber(achat.quantite),
        prix: safeNumber(achat.prix),
        variete: achat.varietes.nom,
        varieteId: achat.varietes.id
      }));

      // Groupement par date
      const achatsParDate = {};
      achatsAvecDates.forEach(achat => {
        const dateStr = achat.date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short'
        });
        
        if (!achatsParDate[dateStr]) {
          achatsParDate[dateStr] = {
            date: dateStr,
            quantite: 0,
            prix: 0
          };
        }
        
        achatsParDate[dateStr].quantite = safeNumber(achatsParDate[dateStr].quantite) + achat.quantite;
        achatsParDate[dateStr].prix = safeNumber(achatsParDate[dateStr].prix) + achat.prix;
      });

      // Préparation des données pour le graphique
      const graphData = Object.entries(achatsParDate)
        .filter(([_, data]) => data && typeof data === 'object')
        .map(([date, data]) => ({
          date,
          quantite: safeToFixed(data.quantite),
          prix: safeToFixed(data.prix)
        }));

      // Tri des données
      const MOIS_FR = [
        'janv.',
        'févr.',
        'mars',
        'avr.',
        'mai',
        'juin',
        'juil.',
        'août',
        'sept.',
        'oct.',
        'nov.',
        'déc.'
      ];

      graphData.sort((a, b) => {
        try {
          const [dayA, monthA] = (a.date || '').split(' ');
          const [dayB, monthB] = (b.date || '').split(' ');
          if (!dayA || !monthA || !dayB || !monthB) return 0;
          
          const monthIndexA = MOIS_FR.indexOf(monthA);
          const monthIndexB = MOIS_FR.indexOf(monthB);
          if (monthIndexA === -1 || monthIndexB === -1) return 0;

          const dateA = new Date(2024, monthIndexA, parseInt(dayA, 10));
          const dateB = new Date(2024, monthIndexB, parseInt(dayB, 10));
          return dateA - dateB;
        } catch (error) {
          console.error('Erreur de tri:', error);
          return 0;
        }
      });

      setProcessedData(graphData);

      // Statistiques par variété
      const statsParVariete = {};
      for (const achat of validAchats) {
        if (!statsParVariete[achat.variete]) {
          statsParVariete[achat.variete] = {
            nom: achat.variete,
            quantiteTotale: 0,
            montantTotal: 0,
            nombreAchats: 0,
            sticksTotal: 0,
            dernierAchat: null,
            varieteId: achat.varieteId
          };
        }

        const stats = statsParVariete[achat.variete];
        stats.quantiteTotale = safeNumber(stats.quantiteTotale) + achat.quantite;
        stats.montantTotal = safeNumber(stats.montantTotal) + achat.prix;
        stats.nombreAchats += 1;
        
        if (!stats.dernierAchat || achat.date > stats.dernierAchat) {
          stats.dernierAchat = achat.date;
        }
      }

      // Récupérer les sticks pour chaque variété
      for (const variete of Object.values(statsParVariete)) {
        try {
          const sticksCount = await supabaseHelper.getSticksByVariete(variete.varieteId);
          variete.sticksTotal = sticksCount;
        } catch (error) {
          console.error(`Erreur lors de la récupération des sticks pour ${variete.nom}:`, error);
          variete.sticksTotal = 0;
        }
      }

      // Formatage des nombres
      Object.values(statsParVariete).forEach(stats => {
        stats.quantiteTotale = safeToFixed(stats.quantiteTotale);
        stats.montantTotal = safeToFixed(stats.montantTotal);
      });

      setVarieteStats(statsParVariete);

      // Calculer les totaux
      const totalQuantite = validAchats.reduce((sum, achat) => sum + safeNumber(achat.quantite), 0);
      const totalMontant = validAchats.reduce((sum, achat) => sum + safeNumber(achat.prix), 0);
      const prixMoyenParGramme = totalQuantite > 0 ? totalMontant / totalQuantite : 0;
      
      // Récupérer les informations du dernier achat
      const dernierAchatData = validAchats[validAchats.length - 1];
      const dernierAchat = dernierAchatData ? new Date(dernierAchatData.created_at) : null;
      const dernierAchatQuantite = dernierAchatData ? safeNumber(dernierAchatData.quantite) : 0;
      const dernierAchatPrix = dernierAchatData ? safeNumber(dernierAchatData.prix) : 0;

      setStats({
        totalQuantite: safeToFixed(totalQuantite),
        totalMontant: safeToFixed(totalMontant),
        prixMoyenParGramme: safeToFixed(prixMoyenParGramme),
        dernierAchat,
        dernierAchatQuantite: safeToFixed(dernierAchatQuantite),
        dernierAchatPrix: safeToFixed(dernierAchatPrix)
      });

    } catch (error) {
      console.error('Erreur lors du traitement des données:', error);
      setProcessedData([]);
      setVarieteStats({});
    }
  }, [achats]);

  useEffect(() => {
    fetchAchats();
  }, []);

  useEffect(() => {
    processAchatsData();
  }, [processAchatsData]);

  const fetchAchats = async () => {
    try {
      const data = await supabaseHelper.getAchats();
      setAchats(data);
      setError('');
    } catch (err) {
      console.error('Erreur lors de la récupération des achats:', err);
      setError('Impossible de charger les données d\'achats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <StatsContainer>Chargement des statistiques d'achats...</StatsContainer>;
  if (error) return <StatsContainer>Erreur : {error}</StatsContainer>;

  return (
    <StatsContainer>
      <Header>
        <Title>Suivi des Achats</Title>
      </Header>

      <StatGrid>
        <StatCard>
          <StatValue>{stats.totalQuantite}g</StatValue>
          <StatLabel>Quantité Totale</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalMontant}€</StatValue>
          <StatLabel>Montant Total</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.prixMoyenParGramme}€/g</StatValue>
          <StatLabel>Prix Moyen par Gramme</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {stats.dernierAchatQuantite}g - {stats.dernierAchatPrix}€
          </StatValue>
          <StatLabel>
            Dernier Achat ({stats.dernierAchat ? stats.dernierAchat.toLocaleDateString('fr-FR') : '-'})
          </StatLabel>
        </StatCard>
      </StatGrid>

      <ChartSection>
        <ChartTitle>Évolution des Achats Totaux</ChartTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#fff' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#fff' }}
                label={{
                  value: 'Quantité (g)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#fff'
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#fff' }}
                label={{
                  value: 'Prix (€)',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#fff'
                }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="quantite"
                name="Quantité (g)"
                stroke="#00ff88"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: '#00ff88' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="prix"
                name="Prix (€)"
                stroke="#00ccff"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: '#00ccff' }}
                style={{ opacity: 0.7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>Détails par Variété</ChartTitle>
        <VarieteStatsGrid>
          {Object.entries(varieteStats).map(([variete, stats]) => (
            <VarieteCard 
              key={variete}
              $color={getVarieteColors(variete).quantite}
            >
              <VarieteHeader>
                <VarieteColor $color={getVarieteColors(variete).quantite} />
                <VarieteName $color={getVarieteColors(variete).quantite}>
                  {variete}
                </VarieteName>
              </VarieteHeader>
              
              <VarieteStatsList>
                <VarieteStatItem>
                  <VarieteItemLabel>Nombre d'achats</VarieteItemLabel>
                  <VarieteItemValue $color={getVarieteColors(variete).quantite}>
                    {stats.nombreAchats}
                  </VarieteItemValue>
                </VarieteStatItem>
                
                <VarieteStatItem>
                  <VarieteItemLabel>Quantité totale</VarieteItemLabel>
                  <VarieteItemValue $color={getVarieteColors(variete).quantite}>
                    {safeToFixed(stats.quantiteTotale)}g
                  </VarieteItemValue>
                </VarieteStatItem>

                <VarieteStatItem>
                  <VarieteItemLabel>Montant total</VarieteItemLabel>
                  <VarieteItemValue $color={getVarieteColors(variete).quantite}>
                    {safeToFixed(stats.montantTotal)}€
                  </VarieteItemValue>
                </VarieteStatItem>

                <VarieteStatItem>
                  <VarieteItemLabel>Sticks total</VarieteItemLabel>
                  <VarieteItemValue $color={getVarieteColors(variete).quantite}>
                    {safeToFixed(stats.sticksTotal)}
                  </VarieteItemValue>
                </VarieteStatItem>

                <VarieteStatItem>
                  <VarieteItemLabel>Dernier achat</VarieteItemLabel>
                  <VarieteItemValue $color={getVarieteColors(variete).quantite}>
                    {stats.dernierAchat?.toLocaleDateString('fr-FR')}
                  </VarieteItemValue>
                </VarieteStatItem>
              </VarieteStatsList>
            </VarieteCard>
          ))}
        </VarieteStatsGrid>
      </ChartSection>
    </StatsContainer>
  );
} 