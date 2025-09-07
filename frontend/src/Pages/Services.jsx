// components/ServicePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Import all modular components
import ImageUpload from '../components/core/Service/ImageUpload';
import AddressForm from '../components/core/Service/AddressForm';
import PickupTypeSelector from '../components/core/Service/PickupTypeSelector';
import CreditSummary from '../components/core/Service/CreditSummary';
import ConfirmationModal from '../components/core/Service/Confirmation';
import Footer from '../components/common/Footer';

// Import API
import { uploadWasteRequest } from '../services/operations/wasteAPI';

const ServicePage = () => {
  const pageRef = useRef(null);
  const summaryRef = useRef(null);

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
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user token for API calls
  const { token } = useSelector((state) => state.auth);

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

  const handleSellClick = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!address || !address.street.trim()) {
      toast.error('Please provide pickup address');
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error('Please specify a valid quantity');
      return;
    }

    // Validate that all images have categories
    const invalidImages = uploadedImages.filter(image => !image.category);
    if (invalidImages.length > 0) {
      toast.error('Please ensure all images have waste categories assigned');
      return;
    }

    // Validate pickup type
    if (!pickupType || !pickupType.id) {
      toast.error('Please select a pickup type');
      return;
    }

    console.log('Validation passed. Starting upload...');
    console.log('Images:', uploadedImages);
    console.log('Address:', address);
    console.log('Quantity:', quantity);
    console.log('Pickup Type:', pickupType);

    setIsSubmitting(true);

    try {
      // Get user's location (lat, lng) - we'll use a simple geolocation
      const position = await getCurrentLocation();
      
      // Prepare form data for each uploaded image
      const requests = uploadedImages.map(async (image) => {
        const formData = new FormData();
        
        // Map frontend category to backend wasteType enum
        const wasteTypeMapping = {
          'plastic': 'plastic',
          'paper': 'paper', 
          'metal': 'metal',
          'organic': 'organic',
          'glass': 'glass',
          'electronic': 'e_waste'
        };
        
        const wasteType = wasteTypeMapping[image.category] || 'others';
        
        // Add all required fields
        formData.append('wasteType', wasteType);
        formData.append('quantity', quantity);
        formData.append('userQuantity', quantity);
        formData.append('address', JSON.stringify({
          street: address.street,
          city: address.city,
          state: address.state,
          pinCode: address.pincode
        }));
        formData.append('lat', position.lat);
        formData.append('lng', position.lng);
        formData.append('isEmergency', pickupType.id === 'urgent');
        
        // Add image file if it exists (for uploaded files)
        if (image.file) {
          formData.append('image', image.file);
        } else {
          // For camera captured images, convert dataURL to File
          const response = await fetch(image.preview);
          const blob = await response.blob();
          const file = new File([blob], image.name, { type: 'image/jpeg' });
          formData.append('image', file);
        }
        
        // Debug FormData contents
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        
        return uploadWasteRequest(formData, token);
      });
      
      // Execute all requests
      const results = await Promise.all(requests);
      
      // Check if any requests failed
      const failedRequests = results.filter(result => !result.success);
      
      if (failedRequests.length > 0) {
        toast.error(`${failedRequests.length} waste uploads failed. Please try again.`);
      } else {
        toast.success('All waste items uploaded successfully!');
        setShowConfirmation(true);
      }
      
    } catch (error) {
      console.error('Error uploading waste:', error);
      toast.error('Failed to upload waste. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback coordinates if geolocation is not available
        resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata default
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback coordinates
          resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata default
        }
      );
    });
  };

  // FIXED: Proper form reset function
  const resetFormToInitial = () => {
    setUploadedImages([]);
    setAddress(initialAddress);
    setPickupType(initialPickupType);
    setQuantity(1);
    setIsSubmitting(false);
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
      <div ref={pageRef} className="min-h-screen bg-[#F9FAFB] py-8">
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
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Sell Your <span className="text-green-400">Waste</span> & Earn <span className="text-purple-400">Credits</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
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
              
              {/* Quantity Input */}
              <motion.div 
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-green-500 mr-3">📦</span>
                  Quantity
                </h2>
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-gray-700 font-medium">
                    Estimated Weight/Quantity (kg):
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="text-gray-500 text-sm">kg</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the approximate weight of your waste materials
                </p>
              </motion.div>
              
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
                quantity={quantity}
                onSellClick={handleSellClick}
                isSubmitting={isSubmitting}
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
