import React from 'react';
import '../pages/AboutUsPage.css'; // Importamos los estilos para AboutUsPage

function AboutUsPage() {
  return (
    <div className="AboutUsPage">
      <div className="about-us-container">
        <h1>Nuestra Historia</h1>
        <p>Somos una pizzería familiar que ha estado sirviendo deliciosas pizzas desde 1995. Nuestra pasión por la pizza nos ha llevado a perfeccionar nuestras recetas y a ofrecer una experiencia gastronómica única a nuestros clientes.</p>
        <p>En Giovannis Pizza, nos enorgullecemos de utilizar los mejores ingredientes frescos y de ofrecer una amplia variedad de opciones para satisfacer todos los gustos. Desde clásicas pizzas de pepperoni hasta creaciones gourmet con ingredientes exclusivos, tenemos algo para todos.</p>
        <p>Nuestro objetivo es proporcionar no solo comida deliciosa, sino también un ambiente acogedor y un servicio excepcional. Ven a visitarnos y únete a la familia Giovannis Pizza.</p>
      </div>
    </div>
  );
}

export default AboutUsPage;
