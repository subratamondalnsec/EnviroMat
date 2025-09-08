// components/service/CreditSummary.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins, TrendingUp, Package } from 'lucide-react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

const CreditSummary = ({ 
  images, 
  pickupType, 
  quantity = 1,
  onSellClick, 
  isSubmitting = false,
  refSetter 
}) => {
  const summaryRef = useRef(null);
  
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    container: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    itemsCard: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700',
    // FIXED: Added quantity card theming
    quantityCard: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700',
    quantityValue: isDarkMode ? 'text-white' : 'text-gray-900',
    creditsCard: isDarkMode ? 'bg-green-900/30 text-gray-300' : 'bg-green-200 text-gray-700',
    reductionCard: isDarkMode ? 'bg-orange-900/30 text-gray-300' : 'bg-orange-100 text-gray-700',
    pickupCard: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100',
    pickupHeading: isDarkMode ? 'text-blue-300' : 'text-blue-900',
    pickupText: isDarkMode ? 'text-blue-200' : 'text-blue-800',
    pickupDesc: isDarkMode ? 'text-blue-300' : 'text-blue-600',
    breakdownHeading: isDarkMode ? 'text-white' : 'text-gray-900',
    itemText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    // FIXED: Updated sell button theming for better dark mode support
    sellButton: isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500' : 'bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700',
    // FIXED: Updated disabled button theming
    disabledButton: isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed',
    // FIXED: Updated spinner color for dark mode
    spinnerBorder: isDarkMode ? 'border-white' : 'border-gray-600',
    // FIXED: Updated coin icon color in button
    coinIcon: isDarkMode ? 'text-white' : 'text-gray-700',
    infoText: isDarkMode ? 'text-gray-400' : 'text-gray-500'
  };

  useEffect(() => {
    if (summaryRef.current) {
      gsap.fromTo(summaryRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, []);

  // Calculate total credits
  const baseCredits = images.reduce((total, image) => total + image.credits, 0);
  const reductionPercentage = pickupType?.reduction || 0;
  const reductionAmount = (baseCredits * reductionPercentage) / 100;
  const finalCredits = baseCredits - reductionAmount;

  const isReadyToSell = images.length > 0 && baseCredits > 0;

  return (
    <div 
      ref={(el) => { summaryRef.current = el; refSetter && refSetter(el); }}
      className={`${themeStyles.container} rounded-3xl p-6 border shadow-sm sticky top-6 transition-colors duration-300`}
    >
      <h3 className={`text-xl font-bold ${themeStyles.heading} mb-6 flex items-center transition-colors duration-300`}>
        <Coins className="w-6 h-6 mr-2 text-green-500" />
        Credit Summary
      </h3>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        <div className={`flex items-center justify-between p-3 ${themeStyles.itemsCard} rounded-lg transition-colors duration-300`}>
          <span className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Items Uploaded
          </span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{images.length}</span>
        </div>

        {/* FIXED: Updated quantity card to use themed styles */}
        <div className={`flex items-center justify-between p-3 ${themeStyles.quantityCard} rounded-lg transition-colors duration-300`}>
          <span className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Quantity
          </span>
          <span className={`font-semibold ${themeStyles.quantityValue} transition-colors duration-300`}>{quantity} kg</span>
        </div>

        <div className={`flex items-center justify-between p-3 ${themeStyles.creditsCard} rounded-lg transition-colors duration-300`}>
          <span>Base Credits</span>
          <span className="font-semibold text-green-600">+{baseCredits}</span>
        </div>

        {reductionAmount > 0 && (
          <div className={`flex items-center justify-between p-3 ${themeStyles.reductionCard} rounded-lg transition-colors duration-300`}>
            <span>Express Fee ({reductionPercentage}%)</span>
            <span className="font-semibold text-orange-600">-{reductionAmount.toFixed(1)}</span>
          </div>
        )}

        <div className={`border-t ${themeStyles.border} pt-4 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${themeStyles.heading} transition-colors duration-300`}>Total Credits</span>
            <span className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Coins />
              {finalCredits.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Pickup Type Info */}
      {pickupType && (
        <div className={`mb-6 p-4 ${themeStyles.pickupCard} rounded-lg transition-colors duration-300`}>
          <h4 className={`font-semibold ${themeStyles.pickupHeading} mb-2 transition-colors duration-300`}>Pickup Details</h4>
          <p className={`text-sm ${themeStyles.pickupText} transition-colors duration-300`}>{pickupType.name}</p>
          <p className={`text-xs ${themeStyles.pickupDesc} transition-colors duration-300`}>{pickupType.description}</p>
        </div>
      )}

      {/* Individual Item Breakdown */}
      {images.length > 0 && (
        <div className="mb-6">
          <h4 className={`font-semibold ${themeStyles.breakdownHeading} mb-3 transition-colors duration-300`}>Item Breakdown</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {images.map((image, index) => (
              <div key={image.id} className="flex items-center justify-between text-sm">
                <span className={`${themeStyles.itemText} truncate mr-2 transition-colors duration-300`}>
                  Item {index + 1} ({image.category})
                </span>
                <span className="text-green-600 font-medium">+{image.credits}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FIXED: Updated Sell Button with proper dark mode theming */}
      <motion.button
        whileHover={{ scale: isReadyToSell && !isSubmitting ? 1.02 : 1 }}
        whileTap={{ scale: isReadyToSell && !isSubmitting ? 0.98 : 1 }}
        onClick={onSellClick}
        disabled={!isReadyToSell || isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          isReadyToSell
            ? themeStyles.sellButton + ' shadow-lg hover:shadow-xl'
            : themeStyles.disabledButton
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${themeStyles.spinnerBorder} mr-2`}></div>
            Uploading...
          </span>
        ) : isReadyToSell ? (
          <span className="flex items-center justify-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sell Waste (<Coins className={`mx-1 w-4 h-4 ${themeStyles.coinIcon} transition-colors duration-300`} /> {finalCredits.toFixed(1)})
          </span>
        ) : (
          'Upload Images to Continue'
        )}
      </motion.button>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${themeStyles.infoText} transition-colors duration-300`}>
          Credits will be added to your account after pickup confirmation
        </p>
      </div>
    </div>
  );
};

export default CreditSummary;
