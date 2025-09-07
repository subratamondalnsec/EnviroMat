// components/common/NavbarComponents/CustomNavLink.jsx
import React from 'react';
import { motion } from "motion/react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CustomNavLink = ({ to, label, addToNavButtonsRefs, index }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    // Active styles remain green for brand consistency
  activeBg: isDarkMode ? 'bg-[#0ae979]' : 'bg-[#0ae979] hover:bg-[#eff8d8]',
  activeText: isDarkMode ? 'hover:text-[#08DF73] text-gray-600' : 'text-gray-600',
    activeBorder: 'border-[#08DF73]',
    
    // Inactive styles adapt to theme
    inactiveBg: isDarkMode ? 'bg-gray-700' : 'bg-[#F9FAFB] hover:bg-[#eff8d8]',
    inactiveText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    inactiveBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    
    // Hover styles
    hoverText: isDarkMode ? 'hover:text-[#08DF73]' : 'hover:text-gray-700',
    hoverBg: 'hover:bg-[#495565]/60',
    hoverBorder: 'hover:border-[#08DF73]'
  };

  return (
    <motion.div
      ref={(el) => addToNavButtonsRefs && addToNavButtonsRefs(el, index)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.90 }}
    >
      <NavLink 
        to={to}
        className={({ isActive }) =>
          `px-4 py-2 rounded-full text-sm font-medium border transform-gpu transition-colors duration-300 ${
            isActive 
              ? `${themeStyles.activeBg} ${themeStyles.activeText} ${themeStyles.activeBorder} ${themeStyles.hoverBg}`
              : `${themeStyles.inactiveBg} ${themeStyles.inactiveText} ${themeStyles.hoverText} ${themeStyles.inactiveBorder} ${themeStyles.hoverBg} ${themeStyles.hoverBorder}`
          }`
        }
      >
        {label}
      </NavLink>
    </motion.div>
  );
};

export default CustomNavLink;
