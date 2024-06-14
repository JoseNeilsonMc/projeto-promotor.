'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from '..//../styles/Banner.module.css';

const feriados = {
  'Ano Novo': [
    'https://via.placeholder.com/800x600/FF0000/000000?text=Feliz+Ano+Novo',
    'https://via.placeholder.com/800x600/00FF00/000000?text=Feliz+Ano+Novo+2',
    'https://via.placeholder.com/800x600/0000FF/000000?text=Feliz+Ano+Novo+3',
    'https://via.placeholder.com/800x600/FFFF00/000000?text=Feliz+Ano+Novo+4',
  ],
  'Natal': [
    'https://via.placeholder.com/800x600/00FFFF/000000?text=Feliz+Natal',
    'https://via.placeholder.com/800x600/FF00FF/000000?text=Feliz+Natal+2',
    'https://via.placeholder.com/800x600/800080/000000?text=Feliz+Natal+3',
    'https://via.placeholder.com/800x600/FFA500/000000?text=Feliz+Natal+4',
  ],
  'Páscoa': [
    'https://via.placeholder.com/800x600/008000/000000?text=Feliz+Páscoa',
    'https://via.placeholder.com/800x600/000080/000000?text=Feliz+Páscoa+2',
    'https://via.placeholder.com/800x600/FFC0CB/000000?text=Feliz+Páscoa+3',
    'https://via.placeholder.com/800x600/800000/000000?text=Feliz+Páscoa+4',
  ],
};

const Banner = () => {
  const [currentFeriadoIndex, setCurrentFeriadoIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const imageContainerRef = useRef(null);

  const feriadoNames = Object.keys(feriados);
  const currentFeriado = feriadoNames[currentFeriadoIndex];
  const images = feriados[currentFeriado];

  const handleNextImage = () => {
    if (!paused) {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setCurrentFeriadoIndex((prevIndex) => (prevIndex + 1) % feriadoNames.length);
      }
    }
  };

  const handleRepeatImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1);
      setCurrentFeriadoIndex((prevIndex) => (prevIndex - 1 + feriadoNames.length) % feriadoNames.length);
    }
  };

  const handleSaveImage = () => {
    const a = document.createElement('a');
    a.href = images[currentIndex];
    a.download = 'image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const interval = setInterval(handleNextImage, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, currentFeriadoIndex, paused]);

  useEffect(() => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollTo({
        left: currentIndex * imageContainerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <div className={styles.banner}>
      <h1 className={styles.title}>Aproveite nossas ideias</h1>
      <div 
        className={styles.imageContainer} 
        ref={imageContainerRef} 
        onMouseEnter={() => setPaused(true)} 
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((src, index) => (
          <div key={index} className={styles.imageWrapper}>
            <img src={src} alt={`${currentFeriado} ${index + 1}`} className={styles.image} />
            <div className={styles.feriadoTitle}>{currentFeriado}</div>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button onClick={handleRepeatImage}>Repetir</button>
        <button onClick={handleSaveImage}>Salvar Imagem</button>
      </div>
    </div>
  );
};

export default Banner;