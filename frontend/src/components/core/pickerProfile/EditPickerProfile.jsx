import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  MapPin, 
  Truck, 
  Star, 
  Save,
  X,
  ArrowLeft 
} from 'lucide-react';

// Import profile API and actions
import { updatePickerProfile } from '../../../services/operations/pickerAPI';
import { setPicker } from '../../../slices/pickerSlice';

const EditPickerProfile = ({ profile, onCancel, onSave }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    vehicleDetails: {
      vehicleType: 'Bicycle',
      vehicleNumber: ''
    },
    serviceAreas: [],
    isActive: true
  });

  // Initialize form data when profile is available or set defaults
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          pinCode: profile.address?.pinCode || ''
        },
        vehicleDetails: {
          vehicleType: profile.vehicleDetails?.vehicleType || 'Bicycle',
          vehicleNumber: profile.vehicleDetails?.vehicleNumber || ''
        },
        serviceAreas: profile.serviceAreas || [],
        isActive: profile.isActive !== undefined ? profile.isActive : true
      });
    } else if (user) {
      // If no profile but user exists (new picker), initialize with user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pinCode: user.address?.pinCode || ''
        },
        vehicleDetails: {
          vehicleType: user.vehicleDetails?.vehicleType || 'Bicycle',
          vehicleNumber: user.vehicleDetails?.vehicleNumber || ''
        },
        serviceAreas: user.serviceAreas || [],
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleServiceAreasChange = (e) => {
    const areas = e.target.value.split(',').map(area => area.trim()).filter(area => area);
    setFormData(prev => ({
      ...prev,
      serviceAreas: areas
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      toast.error('User not found');
      return;
    }

    try {
      const updatedProfile = await dispatch(updatePickerProfile(user._id, formData));
      
      // Profile will be updated in Redux store by the API action
      toast.success('Profile updated successfully');
      onSave(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          pinCode: ''
        },
        vehicleDetails: profile.vehicleDetails || {
          vehicleType: 'Bicycle',
          vehicleNumber: ''
        },
        serviceAreas: profile.serviceAreas || [],
        isActive: profile.isActive !== undefined ? profile.isActive : true
      });
    }
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg"
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="p-2 bg-green-600 bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-green-100">Update your picker information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        I am active and available for pickup assignments
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-1 ml-8">
                      Uncheck this if you're temporarily unavailable for pickups
                    </p>
                  </div>
                </div>

                {/* Address & Vehicle Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Address & Location</span>
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="address.pinCode"
                      value={formData.address.pinCode}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{6}"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="6-digit PIN code"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                    <Truck className="w-5 h-5" />
                    <span>Vehicle Details</span>
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleDetails.vehicleType"
                      value={formData.vehicleDetails.vehicleType}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    >
                      <option value="Bicycle">Bicycle</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.vehicleNumber"
                      value={formData.vehicleDetails.vehicleNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., WB 02 1234"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Leave empty if using bicycle or if vehicle is not registered
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Areas *
                    </label>
                    <textarea
                      name="serviceAreas"
                      value={formData.serviceAreas.join(', ')}
                      onChange={handleServiceAreasChange}
                      required
                      rows={4}
                      placeholder="Enter areas you can service, separated by commas&#10;e.g., Salt Lake, New Town, Park Street, Gariahat"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      List all areas where you can provide waste pickup services
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPickerProfile;
