import React from 'react';

const UserDropdownItem = ({ icon, label, onClick, color = "text-gray-700", hoverBg = "hover:bg-green-50", hoverText = "hover:text-green-700" }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm ${color} ${hoverBg} ${hoverText} transition-colors duration-200 flex items-center gap-2`}
  >
    {icon}
    {label}
  </button>
);

export default UserDropdownItem;
