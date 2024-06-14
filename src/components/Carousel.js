// src/components/Carousel.js

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

function ImageCarousel() {
  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} autoPlay interval={3000} infiniteLoop>
        <div>
          <div className="carousel-placeholder">Imagen 1</div>
        </div>
        <div>
          <div className="carousel-placeholder">Imagen 2</div>
        </div>
        <div>
          <div className="carousel-placeholder">Imagen 3</div>
        </div>
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
