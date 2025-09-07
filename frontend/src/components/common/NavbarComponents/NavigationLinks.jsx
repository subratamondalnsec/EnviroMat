// components/common/NavbarComponents/NavigationLinks.jsx
import React from 'react';
import CustomNavLink from './CustomNavLink';
import { useSelector } from 'react-redux';

const NavigationLinks = ({ addToNavButtonsRefs }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/shop", label: "Shop" },
    { to: "/community", label: "Community" },
    { to: "/about", label: "About" }
  ];

  // Theme-based styles
  const themeStyles = {
    navBg: isDarkMode ? 'bg-gray-800/30' : 'bg-white/30',
    borderColor: isDarkMode ? 'border-gray-600/20' : 'border-white/20'
  };

  return (
    <nav className={`hidden md:flex items-center space-x-3 ${themeStyles.navBg} backdrop-blur-sm px-2 py-3 rounded-full transition-colors duration-300 border ${themeStyles.borderColor}`}>
      {links.map((link, index) => (
        <CustomNavLink
          key={link.to}
          {...link}
          addToNavButtonsRefs={addToNavButtonsRefs}
          index={index}
        />
      ))}
    </nav>
  );
};

export default NavigationLinks;
