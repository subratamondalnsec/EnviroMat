// components/core/Home/ProTeamCard.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const ProTeamCard = () => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-800' : 'bg-[#F8F9FA]',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-600' : 'border-white'
  };

  return (
    <div className={`${themeStyles.background} rounded-3xl p-6 shadow-lg max-w-xs transition-colors duration-300`}>
      <div className="space-y-4">
        {/* Team Photos */}
        <div className="flex -space-x-2">
          <img 
            src="https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Team member 1" 
            className={`w-13 h-13 rounded-full border-2 ${themeStyles.border} object-cover`}
          />
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
            alt="Team member 2" 
            className={`w-13 h-13 rounded-full border-2 ${themeStyles.border} object-cover`}
          />
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" 
            alt="Team member 3" 
            className={`w-13 h-13 rounded-full border-2 ${themeStyles.border} object-cover`}
          />
        </div>
        
        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#C27BFF] tracking-tight">Top Users</h3>
          <p className={`${themeStyles.secondaryText} text-[12px] leading-tight tracking-normal transition-colors duration-300`}>
            Leading the way in sustainable<br />
            waste management solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProTeamCard;
