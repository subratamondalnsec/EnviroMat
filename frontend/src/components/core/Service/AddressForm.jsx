// components/service/AddressForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import gsap from 'gsap';

const AddressForm = ({ address: propAddress, onAddressChange }) => {
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
    <div ref={formRef} className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MapPin className="w-6 h-6 mr-3 text-green-500" />
          Pickup Address
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="bg-[#0ae979] border border-[#08DF73] hover:bg-[#eff8d8] text-gray-600 px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
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
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {locationError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            id="street"
            type="text"
            required
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            id="city"
            type="text"
            required
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Kolkata"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            id="state"
            type="text"
            required
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="West Bengal"
          />
        </div>

        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code *
          </label>
          <input
            id="pincode"
            type="text"
            required
            value={address.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="700001"
          />
        </div>

        <div>
          <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
            Landmark (Optional)
          </label>
          <input
            id="landmark"
            type="text"
            value={address.landmark}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Near metro station, mall, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
