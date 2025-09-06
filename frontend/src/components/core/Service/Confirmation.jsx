// components/service/ConfirmationModal.jsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, MapPin, Coins } from 'lucide-react';
import gsap from 'gsap';

const ConfirmationModal = ({ isOpen, onClose, pickupType, credits }) => {
  const modalRef = useRef(null);

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
        className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Confirmed! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your waste will soon be picked up from your doorstep
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-2xl p-4 mb-6 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pickup Time
                </span>
                <span className="font-semibold text-gray-900">
                  {pickupType?.duration || '2-4 days'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Service Type
                </span>
                <span className="font-semibold text-gray-900">
                  {pickupType?.name || 'Standard Pickup'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Credits Earned</span>
                <span className="font-bold text-green-600 text-lg flex items-center">
                  <Coins className='mx-1 w-4 h-4' />{credits} Credits
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
              className="w-full bg-[#0ae979] border border-[#08DF73] hover:bg-[#eff8d8] text-gray-600 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Continue
            </button>
            
            <p className="text-xs text-gray-500">
              You'll receive pickup confirmation shortly
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
