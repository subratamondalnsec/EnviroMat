// components/pickup/DashboardHeader.jsx
import React from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, MapPin, Star } from 'lucide-react';

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.profile);
  const { picker } = useSelector((state) => state.picker);
  const navigate = useNavigate();
  
  // Use picker data if available, otherwise fall back to user data
  const profile = picker || user;

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'Location not set';
    return `${address.city || 'Unknown'}, ${address.state || 'Unknown'}`;
  };

  // Helper function to format vehicle type
  const formatVehicleType = (vehicleDetails) => {
    if (!vehicleDetails || !vehicleDetails.vehicleType) return 'Not set';
    return vehicleDetails.vehicleType;
  };

  const handleEditClick = () => {
    navigate('/picker-edit-profile');
  };

  // Show default if no profile data
  if (!profile) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-4 mx-8 md:p-6 mt-6 md:mt-20 text-white mb-4 md:mb-6">
        <div className="flex items-center justify-center">
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-4 mx-8 md:p-6 mt-6 md:mt-20 text-white mb-4 md:mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <img
              src={profile.image || `https://api.dicebear.com/5.x/initials/svg?seed=${profile.firstName}%20${profile.lastName}`}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-green-100 text-sm md:text-base flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {formatAddress(profile.address)}
            </p>
            <p className="text-green-100 text-xs md:text-sm">
              Travel Mode: {formatVehicleType(profile.vehicleDetails)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditClick}
            className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
            aria-label="Edit Profile"
          >
            <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </motion.button>
          
          {profile?.rating && (
            <div className="flex items-center gap-2 rounded-full px-3 py-2 text-yellow-800 font-bold bg-yellow-50 shadow-sm border border-yellow-100">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="flex items-center gap-2 text-sm">
                {profile.rating.average?.toFixed(1) || "0.0"}
                <span className="text-xs text-yellow-700">
                  ({profile.rating.count || 0})
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
