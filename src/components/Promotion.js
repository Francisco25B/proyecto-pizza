import React from 'react';

const Promotion = ({ imageSrc, promotionName, promotionPrice }) => {
  return (
    <div className="promotion-item">
      <img src={imageSrc} alt={promotionName} />
      <p>{promotionName}</p>
      <p>${promotionPrice}</p>
    </div>
  );
};

export default Promotion;
