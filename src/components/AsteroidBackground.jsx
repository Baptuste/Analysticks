import React, { useEffect, useState } from 'react';
import styles from './AsteroidBackground.module.css';

// Directions de base avec des angles variés
const directions = [
  { name: 'fall-down', angle: 0 },
  { name: 'fall-up', angle: 180 },
  { name: 'fall-left', angle: 90 },
  { name: 'fall-right', angle: 270 },
  { name: 'fall-diag-1', angle: 45 },
  { name: 'fall-diag-2', angle: 135 },
  { name: 'fall-diag-3', angle: 225 },
  { name: 'fall-diag-4', angle: 315 },
];

// Couleurs disponibles pour les astéroïdes spéciaux avec leurs valeurs RGB
const specialColors = [
  'magenta',
  'cyan',
  'yellow',
  'green',
  'pink',
  'orange',
  'lime',
  'purple'
];

const createAsteroid = () => {
  const id = Date.now() + Math.random();
  
  // Sélection aléatoire d'une direction de base
  const baseDirection = directions[Math.floor(Math.random() * directions.length)];
  
  // Ajout d'une variation aléatoire à l'angle (-20° à +20°)
  const angleVariation = (Math.random() - 0.5) * 40;
  const finalAngle = baseDirection.angle + angleVariation;
  
  // Taille variable avec une distribution plus naturelle
  const size = Math.pow(Math.random(), 1.5) * 4 + 1;
  
  // Vitesse variable avec une distribution plus naturelle
  const baseSpeed = 4 + Math.random() * 6;
  const speedVariation = (Math.random() - 0.5) * 2;
  const duration = baseSpeed + speedVariation;

  // Position initiale avec offset aléatoire
  const offset = Math.random() * 20 - 10; // -10 à +10
  let left = `${Math.random() * 100}%`;
  let top = `${Math.random() * 100}%`;

  // Ajustement des positions initiales en fonction de l'angle
  if (finalAngle < 45 || finalAngle > 315) top = `-10vh`;
  if (finalAngle > 135 && finalAngle < 225) top = `110vh`;
  if (finalAngle > 45 && finalAngle < 135) left = `110vw`;
  if (finalAngle > 225 && finalAngle < 315) left = `-10vw`;

  // Ajout d'un offset aléatoire à la position
  left = `calc(${left} + ${offset}px)`;
  top = `calc(${top} + ${offset}px)`;

  // 35% de chance d'avoir un astéroïde coloré
  const isSpecial = Math.random() < 0.35;
  const specialClass = isSpecial ? `color-${specialColors[Math.floor(Math.random() * specialColors.length)]}` : '';

  // Rotation et échelle aléatoires pour plus de dynamisme
  const rotation = Math.random() * 360;
  const rotationSpeed = (Math.random() - 0.5) * 720; // -360° à +360° par seconde

  return {
    id,
    direction: baseDirection.name,
    left,
    top,
    size,
    duration,
    isSpecial,
    specialClass,
    angle: finalAngle,
    rotation,
    rotationSpeed,
  };
};

export default function AsteroidBackground() {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    // Nombre initial variable d'astéroïdes
    const initialCount = Math.floor(Math.random() * 5) + 12;
    const initial = Array.from({ length: initialCount }, createAsteroid);
    setAsteroids(initial);

    let timeoutId;
    const spawnAsteroid = () => {
      const spawnDelay = 150 + Math.random() * 150;
      const asteroid = createAsteroid();
      
      setAsteroids((prev) => [...prev, asteroid]);

      setTimeout(() => {
        setAsteroids((prev) => prev.filter((a) => a.id !== asteroid.id));
      }, asteroid.duration * 1000);

      timeoutId = setTimeout(spawnAsteroid, spawnDelay);
    };

    spawnAsteroid();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className={styles.asteroidContainer}>
      {asteroids.map((a) => {
        const asteroidStyle = {
          left: a.left,
          top: a.top,
          width: `${a.size}px`,
          height: `${a.size}px`,
          animationDuration: `${a.duration}s`,
          transform: `rotate(${a.rotation}deg)`,
          '--angle': `${a.angle}deg`,
          '--rotation-speed': `${a.rotationSpeed}deg`,
        };

        return (
          <div
            key={a.id}
            className={`${styles.asteroid} ${styles[a.direction]} ${a.isSpecial ? styles.special : ''} ${a.specialClass ? styles[a.specialClass] : ''}`}
            style={asteroidStyle}
          >
            {a.colorInfo && (
              <div
                className={styles.trail}
                style={{
                  background: `linear-gradient(90deg, transparent, ${a.colorInfo.color}, transparent)`
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
