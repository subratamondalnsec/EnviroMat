import React from 'react';
import CustomNavLink from './CustomNavLink';

const NavigationLinks = ({ addToNavButtonsRefs }) => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/shop", label: "Shop" },
    { to: "/community", label: "Community" },
    { to: "/about", label: "About" }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-3 bg-white/30 backdrop-blur-sm px-2 py-3 rounded-full">

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
