import React from 'react';
import marketGlobal from '../assets/market_global.jpg'; 
import Navbar from './Navbar';

const MarketTrends = () => {
  return (
    <>
      <Navbar />
      <div className="image-container">
        <img className='left-full' src={marketGlobal} alt="Market Global" />
      </div>
    </>
  );
};

export default MarketTrends;
