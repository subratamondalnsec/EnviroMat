import React from 'react';
import { motion } from "motion/react";
import AuthenticatedOptions from './AuthenticatedOptions';
import UnauthenticatedOptions from './UnauthenticatedOptions';

const UserDropdown = ({ isOpen, dropdownRef, user, isAuthenticated, handleNavigation, handleLogout }) => (
  isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50"
    >
      {isAuthenticated ? (
        <AuthenticatedOptions handleNavigation={handleNavigation} handleLogout={handleLogout} user={user} />
      ) : (
        <UnauthenticatedOptions handleNavigation={handleNavigation} />
      )}
    </motion.div>
  )
);

export default UserDropdown;
