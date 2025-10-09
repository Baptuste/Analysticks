import styled from 'styled-components';

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:focus {
    outline: 2px solid #00ff88;
    outline-offset: 2px;
  }
`;

const ChartDescription = styled.div`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

const AccessibleChart = ({
  children,
  title,
  description,
  data,
  onKeyDown,
  role = 'img',
  'aria-label': ariaLabel,
  ...props
}) => {
  const handleKeyDown = event => {
    if (onKeyDown) {
      onKeyDown(event);
    }

    // Navigation clavier pour les graphiques
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        // Logique pour naviguer vers le point précédent
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Logique pour naviguer vers le point suivant
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Logique pour sélectionner le point actuel
        break;
      default:
        break;
    }
  };

  return (
    <ChartContainer
      role={role}
      aria-label={ariaLabel || title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <ChartDescription>
        {description || `${title}. ${data?.length || 0} points de données.`}
      </ChartDescription>
      {children}
    </ChartContainer>
  );
};

// Composant spécialisé pour les graphiques en secteurs
export const AccessiblePieChart = ({ data, title, ...props }) => {
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  const description = data
    ?.map(
      item =>
        `${item.name}: ${item.value} (${Math.round((item.value / total) * 100)}%)`
    )
    .join(', ');

  return (
    <AccessibleChart
      title={title}
      description={`Graphique en secteurs: ${description}`}
      data={data}
      role="img"
      aria-label={`Graphique en secteurs ${title}`}
      {...props}
    />
  );
};

// Composant spécialisé pour les graphiques linéaires
export const AccessibleLineChart = ({
  data,
  title,
  xAxis,
  yAxis,
  ...props
}) => {
  const description = data
    ?.map(
      (item, index) =>
        `${xAxis || 'Point'} ${index + 1}: ${yAxis || 'Valeur'} ${item.y || item.value}`
    )
    .join(', ');

  return (
    <AccessibleChart
      title={title}
      description={`Graphique linéaire: ${description}`}
      data={data}
      role="img"
      aria-label={`Graphique linéaire ${title}`}
      {...props}
    />
  );
};

export default AccessibleChart;
