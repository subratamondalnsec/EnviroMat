// components/service/AddressForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

const AddressForm = ({ address: propAddress, onAddressChange }) => {
  // Get dark mode state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // FIXED: Use prop address or initialize with empty values
  const [address, setAddress] = useState(propAddress || {
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  const formRef = useRef(null);

  // Theme-based styles
  const themeStyles = {
    container: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    label: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    input: isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300',
    errorBg: isDarkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-400',
    button: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' : 'bg-[#0ae979] border-[#08DF73] hover:bg-[#eff8d8] text-gray-600'
  };

  // FIXED: Update local state when prop changes (for reset)
  useEffect(() => {
    if (propAddress) {
      setAddress(propAddress);
    }
  }, [propAddress]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, []);

  const handleInputChange = (field, value) => {
    const updatedAddress = { ...address, [field]: value };
    setAddress(updatedAddress);
    onAddressChange(updatedAddress);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Simulate reverse geocoding API call
          const mockAddress = {
            street: '123 Green Street',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700001',
            landmark: 'Near City Center'
          };
          
          setAddress(mockAddress);
          onAddressChange(mockAddress);
          setIsGettingLocation(false);
        } catch (error) {
          setLocationError('Failed to fetch address from coordinates');
          setIsGettingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div 
      ref={formRef} 
      className={`${themeStyles.container} rounded-3xl p-6 border shadow-sm mb-6 transition-colors duration-300`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${themeStyles.heading} flex items-center transition-colors duration-300`}>
          <MapPin className="w-6 h-6 mr-3 text-green-500" />
          Pickup Address
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className={`${themeStyles.button} px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 ${isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGettingLocation ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{isGettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
        </motion.button>
      </div>

      {locationError && (
        <div className={`mb-4 p-3 ${themeStyles.errorBg} border rounded-lg text-sm transition-colors duration-300`}>
          {locationError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="street" className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`}>
            Street Address *
          </label>
          <input
            id="street"
            type="text"
            required
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <label htmlFor="city" className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`}>
            City *
          </label>
          <input
            id="city"
            type="text"
            required
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
            placeholder="Kolkata"
          />
        </div>

        <div>
          <label htmlFor="state" className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`}>
            State *
          </label>
          <input
            id="state"
            type="text"
            required
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
            placeholder="West Bengal"
          />
        </div>

        <div>
          <label htmlFor="pincode" className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`}>
            PIN Code *
          </label>
          <input
            id="pincode"
            type="text"
            required
            value={address.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
            placeholder="700001"
          />
        </div>

        <div>
          <label htmlFor="landmark" className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`}>
            Landmark (Optional)
          </label>
          <input
            id="landmark"
            type="text"
            value={address.landmark}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
            className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
            placeholder="Near metro station, mall, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
