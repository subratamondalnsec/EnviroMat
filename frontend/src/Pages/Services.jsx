// components/ServicePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

// Import all modular components
import ImageUpload from '../components/core/Service/ImageUpload';
import AddressForm from '../components/core/Service/AddressForm';
import PickupTypeSelector from '../components/core/Service/PickupTypeSelector';
import CreditSummary from '../components/core/Service/CreditSummary';
import ConfirmationModal from '../components/core/Service/Confirmation';
import Footer from '../components/common/Footer';

const ServicePage = () => {
  const pageRef = useRef(null);
  const summaryRef = useRef(null);

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Initial state values for proper reset
  const initialAddress = {
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  };

  const initialPickupType = {
    id: 'standard',
    name: 'Standard Pickup',
    description: 'Scheduled pickup within 2-4 days',
    duration: '2-4 days',
    reduction: 0
  };

  // State management
  const [uploadedImages, setUploadedImages] = useState([]);
  const [address, setAddress] = useState(initialAddress);
  const [pickupType, setPickupType] = useState(initialPickupType);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Theme styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    subtitle: isDarkMode ? 'text-gray-300' : 'text-gray-600'
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleImagesChange = (images) => {
    setUploadedImages(images);
  };

  const handleAddressChange = (addressData) => {
    setAddress(addressData);
  };

  const handlePickupTypeChange = (type) => {
    setPickupType(type);
  };

  const handleSellClick = () => {
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (!address || !address.street.trim()) {
      alert('Please provide pickup address');
      return;
    }

    setShowConfirmation(true);
  };

  // FIXED: Proper form reset function
  const resetFormToInitial = () => {
    setUploadedImages([]);
    setAddress(initialAddress);
    setPickupType(initialPickupType);
  };

  // FIXED: Updated confirmation close handler
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // Small delay to ensure modal closes smoothly before reset
    setTimeout(() => {
      resetFormToInitial();
    }, 300);
  };

  // Calculate final credits
  const baseCredits = uploadedImages.reduce((total, image) => total + image.credits, 0);
  const reductionPercentage = pickupType?.reduction || 0;
  const finalCredits = baseCredits - (baseCredits * reductionPercentage) / 100;

  return (
    <>
      <div ref={pageRef} className={`min-h-screen ${themeStyles.background} py-8 transition-colors duration-300`}>
        {/* Background Animation */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Page Header */}
          <div className="text-center mt-24 mb-10">
            <motion.h1 
              className={`text-4xl lg:text-5xl font-bold leading-tight mb-6 ${themeStyles.heading} transition-colors duration-300`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Sell Your <span className="text-green-400">Waste</span> & Earn <span className="text-purple-400">Credits</span>
            </motion.h1>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${themeStyles.subtitle} transition-colors duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upload images of your waste, get pickup scheduled, and earn credits to buy sustainable products
            </motion.p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* FIXED: Removed key prop and pass images as controlled prop */}
              <ImageUpload 
                images={uploadedImages}
                onImagesChange={handleImagesChange} 
              />
              <AddressForm 
                address={address}
                onAddressChange={handleAddressChange} 
              />
              <PickupTypeSelector 
                selectedType={pickupType}
                onPickupTypeChange={handlePickupTypeChange} 
              />
            </div>

            {/* Right Column - Credit Summary */}
            <div className="lg:col-span-1">
              <CreditSummary
                images={uploadedImages}
                pickupType={pickupType}
                onSellClick={handleSellClick}
                refSetter={(el) => summaryRef.current = el}
              />
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          pickupType={pickupType}
          credits={finalCredits.toFixed(1)}
        />
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default ServicePage;
