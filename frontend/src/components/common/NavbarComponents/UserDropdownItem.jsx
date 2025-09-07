// components/common/NavbarComponents/UserDropdownItem.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const UserDropdownItem = ({ icon, label, onClick, color, hoverBg, hoverText }) => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  
  // Define theme-aware default values when props are not provided
  const textColor = color || (isDarkMode ? 'text-gray-300' : 'text-gray-700');
  const hoverBgClass = hoverBg || (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50');
  const hoverTextClass = hoverText || (isDarkMode ? 'hover:text-gray-100' : 'hover:text-green-700');

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBgClass} ${hoverTextClass} transition-colors duration-200 flex items-center gap-2`}
    >
      {icon}
      {label}
    </button>
  );
};

export default UserDropdownItem;
