import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const images = [
  'vibe.jpeg',
  'banner1.jpg',
  'banner2.jpg',
  'banner3.jpg',
  
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {/* Removed navigation arrows */}

      <img src={images[current]} alt={`Slide ${current}`} className="slide-image" />

      <div className="indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator-dot ${index === current ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
