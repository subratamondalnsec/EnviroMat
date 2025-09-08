// components/common/NavbarComponents/UserDropdown.jsx
import React from 'react';
import { motion } from "motion/react";
import { useSelector } from 'react-redux';
import AuthenticatedOptions from './AuthenticatedOptions';
import UnauthenticatedOptions from './UnauthenticatedOptions';

const UserDropdown = ({ isOpen, dropdownRef, user, isAuthenticated, handleNavigation, handleLogout }) => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    dropdownBg: isDarkMode ? 'bg-gray-800/90' : 'bg-white/90',
    borderColor: isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
  };

  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`absolute right-0 mt-2 w-48 ${themeStyles.dropdownBg} backdrop-blur-lg rounded-2xl shadow-2xl border ${themeStyles.borderColor} py-2 z-50 transition-colors duration-300`}
      >
        {isAuthenticated ? (
          <AuthenticatedOptions 
            handleNavigation={handleNavigation} 
            handleLogout={handleLogout} 
            user={user} 
          />
        ) : (
          <UnauthenticatedOptions handleNavigation={handleNavigation} />
        )}
      </motion.div>
    )
  );
};

export default UserDropdown;
