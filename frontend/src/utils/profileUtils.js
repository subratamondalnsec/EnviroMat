// Utility functions for profile management

/**
 * Check if a picker profile has all required fields filled
 * @param {Object} profile - The picker profile object
 * @returns {boolean} - True if profile is complete, false otherwise
 */
export const isPickerProfileComplete = (profile) => {
  if (!profile) return false;

  // Check basic required fields
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'contactNumber'
  ];

  for (const field of requiredFields) {
    if (!profile[field] || profile[field].toString().trim() === '') {
      return false;
    }
  }

  // Check address fields
  if (!profile.address || 
      !profile.address.street || 
      !profile.address.city || 
      !profile.address.state || 
      !profile.address.pinCode) {
    return false;
  }

  // Check vehicle details
  if (!profile.vehicleDetails || 
      !profile.vehicleDetails.vehicleType || 
      !profile.vehicleDetails.vehicleNumber) {
    return false;
  }

  // Check service areas (should have at least one)
  if (!profile.serviceAreas || profile.serviceAreas.length === 0) {
    return false;
  }

  return true;
};

/**
 * Get missing fields from a picker profile
 * @param {Object} profile - The picker profile object
 * @returns {Array} - Array of missing field names
 */
export const getMissingProfileFields = (profile) => {
  const missingFields = [];

  if (!profile) {
    return ['Complete profile setup required'];
  }

  // Check basic fields
  if (!profile.firstName?.trim()) missingFields.push('First Name');
  if (!profile.lastName?.trim()) missingFields.push('Last Name');
  if (!profile.email?.trim()) missingFields.push('Email');
  if (!profile.contactNumber?.trim()) missingFields.push('Contact Number');

  // Check address
  if (!profile.address?.street?.trim()) missingFields.push('Street Address');
  if (!profile.address?.city?.trim()) missingFields.push('City');
  if (!profile.address?.state?.trim()) missingFields.push('State');
  if (!profile.address?.pinCode?.trim()) missingFields.push('PIN Code');

  // Check vehicle details
  if (!profile.vehicleDetails?.vehicleType?.trim()) missingFields.push('Vehicle Type');
  if (!profile.vehicleDetails?.vehicleNumber?.trim()) missingFields.push('Vehicle Number');

  // Check service areas
  if (!profile.serviceAreas || profile.serviceAreas.length === 0) {
    missingFields.push('Service Areas');
  }

  return missingFields;
};
