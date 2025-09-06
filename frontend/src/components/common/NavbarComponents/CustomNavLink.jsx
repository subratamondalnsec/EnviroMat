import React from 'react';
import { motion } from "motion/react";
import { NavLink } from 'react-router-dom';

const CustomNavLink = ({ to, label, addToNavButtonsRefs, index }) => (
  <motion.div
    ref={(el) => addToNavButtonsRefs(el, index)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.90 }}
  >
    <NavLink 
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-full text-sm font-medium border transform-gpu transition-colors duration-300 ${
          isActive 
            ? 'bg-[#0ae979] text-gray-600 border-[#08DF73] hover:bg-[#eff8d8]' 
            : 'bg-[#F9FAFB] text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-[#eff8d8] hover:border-[#08DF73]'
        }`
      }
    >
      {label}
    </NavLink>
  </motion.div>
);

export default CustomNavLink;
