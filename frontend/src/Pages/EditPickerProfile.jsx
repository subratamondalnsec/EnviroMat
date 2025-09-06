import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditPickerProfile from '../components/core/pickerProfile/EditPickerProfile';
import { ACCOUNT_TYPE } from '../utils/constants.jsx';

const EditPickerProfilePage = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }

    // If not a picker, redirect to home
    if (user && user.accountType !== ACCOUNT_TYPE.PICKER) {
      navigate('/');
      return;
    }
  }, [user, token, navigate]);

  // Don't render anything if user is not authenticated or not a picker
  if (!token || (user && user.accountType !== ACCOUNT_TYPE.PICKER)) {
    return null;
  }

  const handleCancel = () => {
    // If user is not a picker or not authenticated, go to home
    if (!user || user.accountType !== ACCOUNT_TYPE.PICKER) {
      navigate('/');
      return;
    }
    
    // Go back to picker profile if cancelling
    navigate('/picker-profile');
  };

  const handleSave = (updatedProfile) => {
    // After successful save, redirect to picker profile
    navigate('/picker-profile');
  };

  return (
    <EditPickerProfile
      profile={user}
      onCancel={handleCancel}
      onSave={handleSave}
    />
  );
};

export default EditPickerProfilePage;
