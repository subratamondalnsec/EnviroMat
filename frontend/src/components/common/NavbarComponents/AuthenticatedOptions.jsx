// components/common/NavbarComponents/AuthenticatedOptions.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import UserDropdownItem from './UserDropdownItem';

const AuthenticatedOptions = ({ handleNavigation, handleLogout, user }) => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const isPicker = user?.accountType === 'Picker';
  
  // Theme-based styles
  const themeStyles = {
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-500',
    borderColor: isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
  };
  
  return (
    <>
      <div className={`px-4 py-2 border-b ${themeStyles.borderColor} transition-colors duration-300`}>
        <p className={`text-sm font-medium ${themeStyles.text}`}>
          {user?.firstName || 'User'} {user?.lastName || ''}
        </p>
        <p className={`text-xs ${themeStyles.secondaryText}`}>
          {user?.email || 'user@example.com'}
        </p>
        {isPicker && (
          <p className="text-xs text-green-600 font-medium">
            Waste Picker
          </p>
        )}
      </div>
      
      {isPicker ? (
        <>
          <UserDropdownItem
            onClick={() => handleNavigation('/pickup-dashboard')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Dashboard"
          />
          <UserDropdownItem
            onClick={() => handleNavigation('/picker-profile')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label="My Profile"
          />
        </>
      ) : (
        <UserDropdownItem
          onClick={() => handleNavigation('/user-profile')}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          label="View Profile"
        />
      )}
      
      <UserDropdownItem
        onClick={handleLogout}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        }
        label="Logout"
        color="text-red-600"
        hoverBg={isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"}
        hoverText="hover:text-red-700"
      />
    </>
  );
};

export default AuthenticatedOptions;
