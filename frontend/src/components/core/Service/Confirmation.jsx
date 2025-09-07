// components/service/ConfirmationModal.jsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, MapPin, Coins } from 'lucide-react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

const ConfirmationModal = ({ isOpen, onClose, pickupType, credits }) => {
  const modalRef = useRef(null);

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    overlay: 'bg-black/20 backdrop-blur-md',
    modal: isDarkMode ? 'bg-gray-800' : 'bg-white',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    body: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    card: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    iconBg: isDarkMode ? 'bg-green-800' : 'bg-green-100',
    button: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' : 'bg-[#0ae979] border-[#08DF73] hover:bg-[#eff8d8] text-gray-600'
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 ${themeStyles.overlay} flex items-center justify-center z-50 p-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className={`${themeStyles.modal} rounded-3xl p-8 max-w-md w-full text-center relative transition-colors duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className={`w-20 h-20 ${themeStyles.iconBg} rounded-full flex items-center justify-center mx-auto transition-colors duration-300`}>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={`text-2xl font-bold ${themeStyles.heading} mb-4 transition-colors duration-300`}>
              Order Confirmed! 🎉
            </h2>
            <p className={`${themeStyles.body} mb-6 transition-colors duration-300`}>
              Your waste will soon be picked up from your doorstep
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`${themeStyles.card} rounded-2xl p-4 mb-6 text-left transition-colors duration-300`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${themeStyles.body} flex items-center transition-colors duration-300`}>
                  <Clock className="w-4 h-4 mr-2" />
                  Pickup Time
                </span>
                <span className={`font-semibold ${themeStyles.heading} transition-colors duration-300`}>
                  {pickupType?.duration || '2-4 days'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`${themeStyles.body} flex items-center transition-colors duration-300`}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Service Type
                </span>
                <span className={`font-semibold ${themeStyles.heading} transition-colors duration-300`}>
                  {pickupType?.name || 'Standard Pickup'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${themeStyles.body} transition-colors duration-300`}>Credits Earned</span>
                <span className="font-bold text-green-600 text-lg flex items-center">
                  <Coins className="mx-1 w-4 h-4" />{credits} Credits
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={onClose}
              className={`w-full ${themeStyles.button} py-3 rounded-xl font-semibold transition-colors duration-200 border`}
            >
              Continue
            </button>
            
            <p className={`text-xs ${themeStyles.body} transition-colors duration-300`}>
              You'll receive pickup confirmation shortly
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
