import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';
import Promotion from './Promotion'; // Importa el componente Promotion

// Importa las imágenes en formato PNG desde la carpeta assets
import imagen1 from '../assets/1.png';
import imagen2 from '../assets/2.png';
import imagen3 from '../assets/3.png';
import imagen4 from '../assets/4.png';
import imagen5 from '../assets/5.png';
import imagen6 from '../assets/6.png';
import imagen7 from '../assets/7.png';

function ImageCarousel() {
  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} autoPlay interval={3000} infiniteLoop>
        <Promotion
          imageSrc={imagen1}
          promotionName="Promoción 1"
          promotionPrice={10.99}
        />
        <Promotion
          imageSrc={imagen2}
          promotionName="Promoción 2"
          promotionPrice={15.99}
        />
        <Promotion
          imageSrc={imagen3}
          promotionName="Promoción 3"
          promotionPrice={12.99}
        />
        <Promotion
          imageSrc={imagen4}
          promotionName="Promoción 4"
          promotionPrice={8.99}
        />
        <Promotion
          imageSrc={imagen5}
          promotionName="Promoción 5"
          promotionPrice={9.99}
        />
        <Promotion
          imageSrc={imagen6}
          promotionName="Promoción 6"
          promotionPrice={11.99}
        />
        <Promotion
          imageSrc={imagen7}
          promotionName="Promoción 7"
          promotionPrice={13.99}
        />
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
