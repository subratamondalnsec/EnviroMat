// components/common/NavbarComponents/Logo.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Logo = ({ logoRef }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-800/30' : 'bg-[#f9fafb4f]',
    hoverBg: isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-[#f9fafb8f]',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    logoContainer: 'bg-green-500' // Keep green for brand consistency
  };

  return (
    <NavLink 
      to="/"
      ref={logoRef}
      className={`flex items-center space-x-2 ${themeStyles.background} backdrop-blur-xl rounded-full px-2 py-1.5 transform-gpu ${themeStyles.hoverBg} transition-colors duration-300`}
    >
      <div className={`w-6 h-6 ${themeStyles.logoContainer} rounded-full flex items-center justify-center`}>
        <img src="/Logo.png" alt="Logo" className="w-4 h-4" />
      </div>
      <span className={`text-lg font-medium tracking-tight ${themeStyles.text} transition-colors duration-300`}>
        EnviroMat
      </span>
    </NavLink>
  );
};

export default Logo;
