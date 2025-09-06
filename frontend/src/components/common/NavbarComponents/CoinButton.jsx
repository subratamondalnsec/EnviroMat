// components/common/NavbarComponents/CoinButton.jsx
import React from 'react';
import { motion } from "motion/react";
import { useSelector } from 'react-redux';

const CoinButton = ({ addToIconButtonsRefs }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    bg: isDarkMode ? 'bg-gray-700' : 'bg-[#F9FAFB]',
    border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    text: isDarkMode ? 'hover:text-[#08DF73] text-gray-300' : 'text-[#4a5565]',
    hoverBorder: isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-400'
  };

  return (
    <motion.button 
      ref={(el) => addToIconButtonsRefs && addToIconButtonsRefs(el, 0)}
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.95 }}
      className={`${themeStyles.bg} backdrop-blur-xl px-2 gap-1 h-10 border ${themeStyles.border} rounded-full flex items-center justify-center ${themeStyles.hoverBorder} transition-colors duration-300 font-[500] ${themeStyles.text} transform-gpu`}
    >
      480
      <img src="/Coin.png" alt="coins" className="w-7 h-7" />
    </motion.button>
  );
};

export default CoinButton;
