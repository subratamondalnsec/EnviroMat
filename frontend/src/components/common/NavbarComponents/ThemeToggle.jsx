// components/common/NavbarComponents/ThemeToggle.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { toggleDarkMode } from '../../../slices/themeSlice';

const ThemeToggle = ({ addToIconButtonsRefs, index, className = "" }) => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  // Theme-based styles
  const themeStyles = {
    buttonBg: isDarkMode ? 'bg-gray-700' : 'bg-[#F9FAFB]',
    buttonBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    buttonHover: isDarkMode ? 'hover:bg-gray-600 hover:border-gray-500' : 'hover:border-gray-400',
    iconColor: isDarkMode ? 'text-[#08DF73]' : 'text-gray-600 hover:text-[#08DF73]'
  };

  return (
    <motion.button
      ref={(el) => addToIconButtonsRefs && addToIconButtonsRefs(el, index)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`${themeStyles.buttonBg} backdrop-blur-xl border ${themeStyles.buttonBorder} rounded-full flex items-center justify-center ${themeStyles.buttonHover} transition-all duration-300 transform-gpu ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className={`w-5 h-5 ${themeStyles.iconColor}`} />
      ) : (
        <Moon className={`w-5 h-5 ${themeStyles.iconColor}`} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
