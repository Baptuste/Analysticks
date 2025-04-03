import React, { useEffect, useState } from 'react';
import { Home, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import styles from './Statistiques.module.css';

export default function Statistiques() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbxOv8QkQaBTqVK3U0WKUjbDjiTCig3k0TO8MESZLMUyFJTPPaPO6pl215Fij95vcO6Z/exec')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Erreur lors du fetch des données', err));
  }, []);

  useEffect(() => {
    let start = 0;
    const end = data.length;
    if (start === end) return;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setAnimatedCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [data]);

  const repartitionCounts = data.reduce((acc, entry) => {
    const key = entry.repartition || entry['Répartition'] || 'Inconnue';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(repartitionCounts).map(([key, value]) => ({ name: key, value }));
  const pieColors = ['#00ff88', '#0088ff', '#8800ff', '#ff0088', '#ffaa00', '#00ffff', '#44ff00'];

  const activityByDay = data.reduce((acc, entry) => {
    const date = new Date(entry.timestamp);
    const day = date.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const allDays = Object.entries(activityByDay).sort(([a, b]) => new Date(a) - new Date(b));
  const lastThreeDays = allDays.slice(-3).sort((a, b) => b[1] - a[1]);
  const bestDay = lastThreeDays.reduce((max, curr) => curr[1] > max[1] ? curr : max, ["", 0]);

  const lastWeek = allDays.slice(-14, -7);
  const thisWeek = allDays.slice(-7);

  const lastWeekSum = lastWeek.reduce((sum, [, count]) => sum + count, 0);
  const thisWeekSum = thisWeek.reduce((sum, [, count]) => sum + count, 0);

  const variation = lastWeekSum === 0 ? 0 : Math.round(((thisWeekSum - lastWeekSum) / lastWeekSum) * 100);
  const variationColor = variation < 0 ? styles.variationNegative : styles.variationPositive;

  const fadeSlide = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const getRelativeDayLabel = (dateStr) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = today.setHours(0, 0, 0, 0) - targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Aujourd’hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays === 2) return 'Avant-hier';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <video autoPlay loop muted playsInline className={styles.videoBackground}>
        <source src="/kekra-loop-processed.mp4" type="video/mp4" />
      </video>

      <button className={styles.homeButton} onClick={() => navigate('/')} aria-label="Retour à l'accueil">
        <Home size={28} color="#00ff88" />
      </button>

      <h1 className={styles.mainTitle}>Statistiques</h1>
      <p className={styles.counter}> {animatedCount}</p>

      <div className={styles.content}>
        <motion.div className={styles.card} variants={fadeSlide} initial="hidden" animate="visible">
          <h2>Répartition</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                outerRadius={90}
                label={({ value }) => value}
                labelLine
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  borderColor: '#00ffaa',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${name} : ${value}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className={styles.card} variants={fadeSlide} initial="hidden" animate="visible">
          <h2>
            Activité récente{' '}
            <span className={variationColor}>({variation > 0 ? '+' : ''}{variation}%)</span>
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={thisWeek.map(([date, count]) => ({ date: date.slice(5), count }))} barCategoryGap={10}>
              <XAxis dataKey="date" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#00ff88', color: '#fff' }} />
              <Bar dataKey="count" fill="#00ffcc" radius={[10, 10, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className={styles.card} variants={fadeSlide} initial="hidden" animate="visible">
          <h2>Résumé des 3 derniers jours</h2>
          <div className={styles.scoreTable}>
            <div className={styles.scoreHeader}>
              <span>Date</span>
              <span>Formulaires</span>
              <span>Tendance</span>
            </div>
            {lastThreeDays.map(([date, count], index) => {
              const previous = index > 0 ? lastThreeDays[index - 1][1] : null;
              let trend = '•';
              if (previous !== null) {
                if (count > previous) trend = <ArrowUp className="trend-up" size={18} color="#00ff88" />;
                else if (count < previous) trend = <ArrowDown className="trend-down" size={18} color="#ff5555" />;
                else trend = <Minus className="trend-stable" size={18} color="#cccccc" />;
              }
              return (
                <div className={styles.scoreRow} key={date}>
                  <span>{getRelativeDayLabel(date)}</span>
                  <span>{count}</span>
                  <span>{trend}</span>
                </div>
              );
            })}
            <div className={styles.highlight}>🏆 Pic d’activité : {getRelativeDayLabel(bestDay[0])} ({bestDay[1]} formulaires)</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
