// components/ServicePage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

// Import all modular components
import ImageUpload from "../components/core/Service/ImageUpload";
import AddressForm from "../components/core/Service/AddressForm";
import PickupTypeSelector from "../components/core/Service/PickupTypeSelector";
import CreditSummary from "../components/core/Service/CreditSummary";
import ConfirmationModal from "../components/core/Service/Confirmation";
import Footer from "../components/common/Footer";

// Import API
import { uploadWasteRequest } from "../services/operations/wasteAPI";

const ServicePage = () => {
  const pageRef = useRef(null);
  const summaryRef = useRef(null);

  // Get theme state from Redux
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Initial state values for proper reset
  const initialAddress = {
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  };

  const initialPickupType = {
    id: "standard",
    name: "Standard Pickup",
    description: "Scheduled pickup within 2-4 days",
    duration: "2-4 days",
    reduction: 0,
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

  // Theme styles
  const themeStyles = {
    background: isDarkMode ? "bg-gray-900" : "bg-[#F9FAFB]",
    heading: isDarkMode ? "text-white" : "text-gray-900",
    subtitle: isDarkMode ? "text-gray-300" : "text-gray-600",
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

  const handleSellClick = async () => {
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!address || !address.street.trim()) {
      toast.error("Please provide pickup address");
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error("Please specify a valid quantity");
      return;
    }

    // Validate that all images have categories
    const invalidImages = uploadedImages.filter((image) => !image.category);
    if (invalidImages.length > 0) {
      toast.error("Please ensure all images have waste categories assigned");
      return;
    }

    // Validate pickup type
    if (!pickupType || !pickupType.id) {
      toast.error("Please select a pickup type");
      return;
    }

    console.log("Validation passed. Starting upload...");
    console.log("Images:", uploadedImages);
    console.log("Address:", address);
    console.log("Quantity:", quantity);
    console.log("Pickup Type:", pickupType);

    setIsSubmitting(true);

    try {
      // Get user's location (lat, lng) - we'll use a simple geolocation
      const position = await getCurrentLocation();

      // Prepare form data for each uploaded image
      const requests = uploadedImages.map(async (image) => {
        const formData = new FormData();

        // Map frontend category to backend wasteType enum
        const wasteTypeMapping = {
          plastic: "plastic",
          paper: "paper",
          metal: "metal",
          organic: "organic",
          glass: "glass",
          electronic: "e_waste",
        };

        const wasteType = wasteTypeMapping[image.category] || "others";

        // Add all required fields
        formData.append("wasteType", wasteType);
        formData.append("quantity", quantity);
        formData.append("userQuantity", quantity);
        formData.append(
          "address",
          JSON.stringify({
            street: address.street,
            city: address.city,
            state: address.state,
            pinCode: address.pincode,
          })
        );
        formData.append("lat", position.lat);
        formData.append("lng", position.lng);
        formData.append("isEmergency", pickupType.id === "urgent");

        // Add image file if it exists (for uploaded files)
        if (image.file) {
          formData.append("image", image.file);
        } else {
          // For camera captured images, convert dataURL to File
          const response = await fetch(image.preview);
          const blob = await response.blob();
          const file = new File([blob], image.name, { type: "image/jpeg" });
          formData.append("image", file);
        }

        // Debug FormData contents
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        return uploadWasteRequest(formData, token);
      });

      // Execute all requests
      const results = await Promise.all(requests);

      // Check if any requests failed
      const failedRequests = results.filter((result) => !result.success);

      if (failedRequests.length > 0) {
        toast.error(
          `${failedRequests.length} waste uploads failed. Please try again.`
        );
      } else {
        toast.success("All waste items uploaded successfully!");
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error uploading waste:", error);
      toast.error("Failed to upload waste. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using fallback coordinates');
        // Fallback coordinates if geolocation is not available
        resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata default
        return;
      }

      // Check if the page is served over HTTPS (required for geolocation in modern browsers)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('Geolocation requires HTTPS, using fallback coordinates');
        resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata default
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got user coordinates for waste upload:', position.coords.latitude, position.coords.longitude);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          console.warn(errorMessage + ', using fallback coordinates');
          // Fallback coordinates
          resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata default
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
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
  const baseCredits = uploadedImages.reduce(
    (total, image) => total + image.credits,
    0
  );
  const reductionPercentage = pickupType?.reduction || 0;
  const finalCredits = baseCredits - (baseCredits * reductionPercentage) / 100;

  return (
    <>
      <div
        ref={pageRef}
        className={`min-h-screen ${themeStyles.background} py-8 transition-colors duration-300`}
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle, #10B981 1px, transparent 1px)",
            backgroundSize: "80px 80px",
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
              Sell Your <span className="text-green-400">Waste</span> & Earn{" "}
              <span className="text-purple-400">Credits</span>
            </motion.h1>
            <motion.p
              className={`text-xl max-w-3xl mx-auto ${themeStyles.subtitle} transition-colors duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upload images of your waste, get pickup scheduled, and earn
              credits to buy sustainable products
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
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                } rounded-3xl p-6 border shadow-sm transition-colors duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } transition-colors duration-300`}
                >
                  <span className="text-green-500 mr-3">📦</span>
                  Quantity
                </h2>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="quantity"
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300`}
                  >
                    Estimated Weight/Quantity (kg):
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className={`border rounded-lg px-4 py-2 w-24 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } transition-colors duration-300`}
                  >
                    kg
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } transition-colors duration-300`}
                >
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
                refSetter={(el) => (summaryRef.current = el)}
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
