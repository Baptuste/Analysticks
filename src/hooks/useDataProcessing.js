import { useMemo, useCallback } from 'react';

export const useDataProcessing = entries => {
  // Traitement des données par jour
  const weeklyData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const dailyConsumption = {};

    // Trouver la première et la dernière date
    const dates = entries.map(entry => new Date(entry.timestamp));
    const firstDate = new Date(Math.min(...dates));
    const lastDate = new Date(Math.max(...dates));

    // Créer une entrée pour chaque jour
    const currentDate = new Date(firstDate);
    while (currentDate <= lastDate) {
      const date = new Date(currentDate);
      const monthName = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
      }).format(date);
      const dayLabel = `${date.getDate()} ${monthName}`;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      dailyConsumption[dayLabel] = {
        day: dayLabel,
        count: 0,
        x: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        y: 0,
        timestamp: new Date(date),
        monthKey,
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ajouter les entrées existantes
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const monthName = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
      }).format(date);
      const dayLabel = `${date.getDate()} ${monthName}`;

      if (!dailyConsumption[dayLabel]) {
        dailyConsumption[dayLabel] = {
          x: dayLabel,
          y: 0,
          count: 0,
          day: date.toISOString().split('T')[0],
          monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        };
      }

      dailyConsumption[dayLabel].count += 1;
      dailyConsumption[dayLabel].y = dailyConsumption[dayLabel].count;
    });

    return Object.values(dailyConsumption)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item, index, array) => {
        const isFirstOfMonth =
          index === 0 || item.monthKey !== array[index - 1].monthKey;

        return {
          x: isFirstOfMonth ? item.x : '',
          y: item.y,
          value: item.count,
          fullDate: item.day,
          monthKey: item.monthKey,
        };
      });
  }, [entries]);

  // Traitement des données par type
  const typesData = useMemo(() => {
    const typeCount = entries.reduce((acc, entry) => {
      const type = entry.variete?.type || 'Inconnu';
      if (!acc[type]) {
        acc[type] = { type, count: 0 };
      }
      acc[type].count += 1;
      return acc;
    }, {});

    return Object.values(typeCount)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        name: item.type,
        value: item.count,
      }));
  }, [entries]);

  // Traitement des données par répartition
  const repartitionData = useMemo(() => {
    const repartitionCount = entries.reduce((acc, entry) => {
      if (!acc[entry.repartition]) {
        acc[entry.repartition] = { name: entry.repartition, count: 0 };
      }
      acc[entry.repartition].count += 1;
      return acc;
    }, {});

    return Object.values(repartitionCount)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        name: item.name,
        value: item.count,
      }));
  }, [entries]);

  // Traitement des données par longueur
  const longueursData = useMemo(() => {
    const longueurCount = entries.reduce((acc, entry) => {
      if (!acc[entry.longueur]) {
        acc[entry.longueur] = { name: entry.longueur, count: 0 };
      }
      acc[entry.longueur].count += 1;
      return acc;
    }, {});

    return Object.values(longueurCount)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        name: item.name,
        value: item.count,
      }));
  }, [entries]);

  // Traitement des données par largeur
  const largeursData = useMemo(() => {
    const largeurCount = entries.reduce((acc, entry) => {
      if (!acc[entry.largeur]) {
        acc[entry.largeur] = { name: entry.largeur, count: 0 };
      }
      acc[entry.largeur].count += 1;
      return acc;
    }, {});

    return Object.values(largeurCount)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        name: item.name,
        value: item.count,
      }));
  }, [entries]);

  // Calcul des KPIs
  const kpis = useMemo(() => {
    const total = entries.length;
    const moyenneHebdo = Math.round(total / Math.max(weeklyData.length, 1));
    const derniereSemaine = weeklyData[weeklyData.length - 1]?.y || 0;
    const semainePrecedente = weeklyData[weeklyData.length - 2]?.y || 0;
    const tendance = semainePrecedente
      ? Math.round(
          ((derniereSemaine - semainePrecedente) / semainePrecedente) * 100
        )
      : 0;

    return {
      total,
      moyenneHebdo,
      tendance,
      typePopulaire: typesData[0]?.name || 'Inconnu',
      repartitionPopulaire: repartitionData[0]?.name || 'Inconnue',
    };
  }, [entries, weeklyData, typesData, repartitionData]);

  // Fonction de comparaison
  const calculerComparaison = useCallback((donnees, jours) => {
    if (!donnees || donnees.length === 0) return { valeur: 0, variation: 0 };

    const maintenant = donnees[donnees.length - 1]?.y || 0;
    const precedent = donnees[donnees.length - 1 - jours]?.y || 0;

    const variation =
      precedent !== 0 ? ((maintenant - precedent) / precedent) * 100 : 0;

    return {
      valeur: maintenant,
      variation: Math.round(variation),
    };
  }, []);

  return {
    weeklyData,
    typesData,
    repartitionData,
    longueursData,
    largeursData,
    kpis,
    calculerComparaison,
  };
};
