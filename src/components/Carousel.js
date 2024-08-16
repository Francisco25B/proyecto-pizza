import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';
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
  const handleImageClick = (promotionName, imageSrc) => {
    Swal.fire({
      title: '¿Más información?',
      text: `Si requiere más información sobre ${promotionName}, comuníquese al número 771 217 2139.`,
      imageUrl: imageSrc,
      imageAlt: promotionName,
      confirmButtonText: 'OK'
    });
  };

  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} autoPlay interval={3000} infiniteLoop>
        <div onClick={() => handleImageClick("Promoción 1", imagen1)}>
          <Promotion
            imageSrc={imagen1}
            promotionName="Promoción 1"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 2", imagen2)}>
          <Promotion
            imageSrc={imagen2}
            promotionName="Promoción 2"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 3", imagen3)}>
          <Promotion
            imageSrc={imagen3}
            promotionName="Promoción 3"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 4", imagen4)}>
          <Promotion
            imageSrc={imagen4}
            promotionName="Promoción 4"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 5", imagen5)}>
          <Promotion
            imageSrc={imagen5}
            promotionName="Promoción 5"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 6", imagen6)}>
          <Promotion
            imageSrc={imagen6}
            promotionName="Promoción 6"
          />
        </div>
        <div onClick={() => handleImageClick("Promoción 7", imagen7)}>
          <Promotion
            imageSrc={imagen7}
            promotionName="Promoción 7"
          />
        </div>
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
