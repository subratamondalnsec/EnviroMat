import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { wasteEndpoints } from '../apis';

const {
  UPLOAD_WASTE_API,
  CANCEL_PICKUP_REQUEST_API,
  START_PICKUP_API,
  COMPLETE_PICKUP_API,
} = wasteEndpoints;

// Upload waste request
export async function uploadWasteRequest(formData, token) {
  const toastId = toast.loading('Uploading waste...');
  console.log('FormData to be sent:', formData);
  try {
    const response = await apiConnector(
      'POST',
      UPLOAD_WASTE_API,
      formData,
      {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it
      }
    );

    console.log('UPLOAD_WASTE_API API RESPONSE............', response);

    // Check if response is successful (status 200-299)
    if (response.status >= 200 && response.status < 300) {
      toast.success(response?.data?.message || 'Waste uploaded successfully!');
      return { success: true, data: response.data };
    } else {
      throw new Error(response?.data?.message || 'Upload failed');
    }

  } catch (error) {
    console.log('UPLOAD_WASTE_API API ERROR............', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    toast.dismiss(toastId);
  }
}

// Cancel pickup request
export async function cancelPickupRequest(requestId, token) {
  const toastId = toast.loading('Cancelling pickup request...');
  
  try {
    const response = await apiConnector(
      'POST',
      CANCEL_PICKUP_REQUEST_API,
      { requestId },
      {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );

    console.log('CANCEL_PICKUP_REQUEST_API API RESPONSE............', response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Cancellation failed');
    }

    toast.success('Pickup request cancelled successfully!');
    return { success: true, data: response.data };

  } catch (error) {
    console.log('CANCEL_PICKUP_REQUEST_API API ERROR............', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Cancellation failed';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    toast.dismiss(toastId);
  }
}

// Start pickup (for pickers)
export async function startPickup(requestId, token) {
  const toastId = toast.loading('Starting pickup...');
  
  try {
    const response = await apiConnector(
      'POST',
      START_PICKUP_API,
      { requestId },
      {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );

    console.log('START_PICKUP_API API RESPONSE............', response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Failed to start pickup');
    }

    toast.success('Pickup started successfully!');
    return { success: true, data: response.data };

  } catch (error) {
    console.log('START_PICKUP_API API ERROR............', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to start pickup';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    toast.dismiss(toastId);
  }
}

// Complete pickup (for pickers)
export async function completePickup(requestId, verifiedQuantity, qualityRating, token) {
  const toastId = toast.loading('Completing pickup...');
  
  try {
    const response = await apiConnector(
      'POST',
      COMPLETE_PICKUP_API,
      { requestId, verifiedQuantity, qualityRating },
      {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );

    console.log('COMPLETE_PICKUP_API API RESPONSE............', response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Failed to complete pickup');
    }

    toast.success('Pickup completed successfully!');
    return { success: true, data: response.data };

  } catch (error) {
    console.log('COMPLETE_PICKUP_API API ERROR............', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to complete pickup';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    toast.dismiss(toastId);
  }
}
