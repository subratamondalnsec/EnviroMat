import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo = ({ logoRef }) => (
  <NavLink 
    to="/"
    ref={logoRef}
    className="flex items-center space-x-2 bg-[#f9fafb4f] backdrop-blur-xl rounded-full px-2 py-[6px] transform-gpu hover:bg-[#f9fafb8f] transition-colors duration-200"
  >
    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
      <img src="/Logo.png" alt="Logo" className="w-4 h-4" />
    </div>
    <span className="text-[18px] font-[500] tracking-tight text-gray-900">
      EnviroMat
    </span>
  </NavLink>
);

export default Logo;
