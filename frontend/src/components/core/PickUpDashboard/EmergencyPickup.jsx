// components/pickup/EmergencyPickups.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, MapPin, Clock, User, Zap } from 'lucide-react';
import { useDispatch } from 'react-redux';
import gsap from 'gsap';
import PickupDetailsModal from './PickupDetailsModal';
import { markPickupSuccessful } from '../../../services/operations/pickerAPI';

const EmergencyPickups = ({ emergencies, refSetter }) => {
  const listRef = useRef(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Add null check for emergencies
  const safeEmergencies = emergencies || [];

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(listRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, listRef);

    return () => ctx.revert();
  }, [safeEmergencies]);

  const getPriorityColor = (isEmergency) => {
    return isEmergency ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800';
  };

  // Helper function to format waste type
  const formatWasteType = (wasteType) => {
    return wasteType.replace('_', ' ').toUpperCase();
  };

  // Helper function to format address
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle pickup card click
  const handlePickupClick = (pickup) => {
    setSelectedPickup(pickup);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPickup(null);
  };

  // Handle mark as successful
  const handleMarkSuccessful = async (pickupId, isEmergency) => {
    try {
      await dispatch(markPickupSuccessful(pickupId, isEmergency));
    } catch (error) {
      console.error('Error marking pickup as successful:', error);
    }
  };

  return (
    <div 
      ref={refSetter}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-red-600 flex items-center">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          Emergency Pickups
        </h2>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
          {safeEmergencies.length} Emergency
        </span>
      </div>

      <div ref={listRef} className="space-y-3 max-h-96 overflow-y-auto">
        {safeEmergencies.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No emergency pickups</p>
          </div>
        ) : (
          safeEmergencies.map((emergency) => (
            <motion.div
              key={emergency._id}
              className="border-l-4 border-red-500 bg-red-50 rounded-2xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ y: -2 }}
              onClick={() => handlePickupClick(emergency)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {emergency.userId?.firstName} {emergency.userId?.lastName}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(emergency.isEmergency)}`}>
                    URGENT
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.pickupStatus)}`}>
                    {emergency.pickupStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="truncate">{formatAddress(emergency.address)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    <span>{new Date(emergency.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{formatWasteType(emergency.wasteType)}</span>
                    <span className="font-medium">Qty: {emergency.quantity} kg</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pickup Details Modal */}
      <PickupDetailsModal
        pickup={selectedPickup}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onMarkSuccessful={handleMarkSuccessful}
      />
    </div>
  );
};

export default EmergencyPickups;
