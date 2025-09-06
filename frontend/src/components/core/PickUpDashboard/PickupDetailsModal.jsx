import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, User, Package, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import gsap from 'gsap';

const PickupDetailsModal = ({ 
  pickup, 
  isOpen, 
  onClose, 
  onMarkSuccessful 
}) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      const ctx = gsap.context(() => {
        gsap.fromTo(modalRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }, modalRef);

      return () => {
        document.body.style.overflow = 'unset';
        ctx.revert();
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!pickup) return null;

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200 shadow-blue-100';
      case 'processing':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 shadow-yellow-100';
      case 'delivered':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200 shadow-green-100';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 shadow-red-100';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200 shadow-gray-100';
    }
  };

  const formatWasteType = (wasteType) => {
    return wasteType.replace('_', ' ').toUpperCase();
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''}${address.pinCode ? ` - ${address.pinCode}` : ''}`.replace(/^,\s*/, '');
  };

  const handleMarkSuccessful = async () => {
    if (pickup.pickupStatus === 'delivered') {
      toast.error('This pickup has already been marked as delivered');
      return;
    }

    try {
      await onMarkSuccessful(pickup._id, pickup.isEmergency);
      onClose();
    } catch (error) {
      console.error('Error marking pickup as successful:', error);
      toast.error('Failed to update pickup status');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 lg:p-6"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[55vh] overflow-hidden shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[55vh] flex flex-col">
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
                      {pickup.isEmergency ? (
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      )}
                      <span className="leading-tight text-sm sm:text-base lg:text-lg">
                        {pickup.isEmergency ? 'Emergency Pickup' : 'Scheduled Pickup'} Details
                      </span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(pickup.pickupStatus)}`}>
                    {pickup.pickupStatus.toUpperCase()}
                  </span>
                  {pickup.isEmergency && (
                    <motion.span 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 shadow-sm shadow-red-100"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      URGENT
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-4 overflow-y-auto">
                {/* Customer Information */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center">
                    <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                    </div>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/70 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Name</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {pickup.userId?.firstName} {pickup.userId?.lastName}
                      </p>
                    </div>
                    {pickup.userId?.contactNumber && (
                      <div className="bg-white/70 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Contact</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-green-500" />
                          {pickup.userId.contactNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Pickup Details Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* Address */}
                  <div className="sm:col-span-2 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                    <div className="flex items-start space-x-2">
                      <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-1">Pickup Address</p>
                        <p className="text-xs sm:text-sm text-gray-900 break-words">
                          {formatAddress(pickup.address)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Scheduled Date</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {new Date(pickup.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Waste Type */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Waste Type</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {formatWasteType(pickup.wasteType)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-orange-100 rounded-lg">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Kg</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Quantity</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {pickup.quantity} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Waste Image - INCREASED HEIGHT */}
                {pickup.imageURL && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4"
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Waste Image
                    </h3>
                    <div className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200">
                      <img
                        src={pickup.imageURL}
                        alt="Waste"
                        className="w-full h-56 sm:h-72 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0 z-10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    Close
                  </button>
                  
                  {pickup.pickupStatus !== 'delivered' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkSuccessful}
                      className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg shadow-green-200 text-sm"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                      Mark as Successful
                    </motion.button>
                  )}

                  {pickup.pickupStatus === 'delivered' && (
                    <div className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg sm:rounded-xl font-medium flex items-center justify-center border border-green-300 text-sm">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                      Pickup Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PickupDetailsModal;
