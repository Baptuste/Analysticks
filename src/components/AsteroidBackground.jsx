import React, { useEffect, useState } from 'react';
import styles from './AsteroidBackground.module.css';

const directions = [
  'fall-down',
  'fall-up',
  'fall-left',
  'fall-right',
  'fall-diag-1',
  'fall-diag-2',
];

const specialVariants = [
  { class: 'color-magenta', color: '#ff4ec4' },
  { class: 'color-cyan', color: '#00ccff' },
  { class: 'color-yellow', color: '#ffcc00' },
  { class: 'color-green', color: '#00ff88' },
  { class: 'color-pink', color: '#ff0066' },
  { class: 'color-orange', color: '#ff9900' },
  { class: 'color-lime', color: '#66ff66' },
  { class: 'color-purple', color: '#cc99ff' },
];

const createAsteroid = () => {
  const id = Date.now() + Math.random();
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const size = Math.random() * 4 + 2;
  const duration = 4 + Math.random() * 6;

  let left = `${Math.random() * 100}%`;
  let top = `${Math.random() * 100}%`;

  if (direction === 'fall-down') top = '-10vh';
  if (direction === 'fall-up') top = '110vh';
  if (direction === 'fall-left') left = '110vw';
  if (direction === 'fall-right') left = '-10vw';
  if (direction === 'fall-diag-1') { top = '-10vh'; left = '-10vw'; }
  if (direction === 'fall-diag-2') { top = '-10vh'; left = '110vw'; }

  const isSpecial = Math.random() < 0.1;
  const specialClass = isSpecial
    ? specialVariants[Math.floor(Math.random() * specialVariants.length)].class
    : '';

  return {
    id,
    direction,
    left,
    top,
    size,
    duration,
    specialClass,
  };
};

export default function AsteroidBackground() {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const initial = Array.from({ length: 10 }, createAsteroid);
    setAsteroids(initial);

    const interval = setInterval(() => {
      const asteroid = createAsteroid();
      setAsteroids((prev) => [...prev, asteroid]);

      setTimeout(() => {
        setAsteroids((prev) => prev.filter((a) => a.id !== asteroid.id));
      }, asteroid.duration * 1000);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.asteroidContainer}>
      {asteroids.map((a) => (
        <div
          key={a.id}
          className={`${styles.asteroid} ${styles[a.direction]} ${a.specialClass ? styles[a.specialClass] : ''}`}
          style={{
            left: a.left,
            top: a.top,
            width: `${a.size}px`,
            height: `${a.size}px`,
            animationDuration: `${a.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
