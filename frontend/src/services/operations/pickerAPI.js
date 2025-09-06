import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { pickerEndpoints } from "../apis";
import { 
  setPicker, 
  setAssignedPickups, 
  setEmergencyPickups, 
  setDashboardStats,
  setLoading, 
  setError,
  clearError,
  updatePickupStatus
} from "../../slices/pickerSlice";

const { 
  GET_PROFILE_API,
  UPDATE_PROFILE_API,
  GET_ASSIGNED_PICKUPS_API,
  GET_EMERGENCY_PICKUPS_API,
  GET_DASHBOARD_STATS_API,
  COMPLETE_TASK_API
} = pickerEndpoints;

// Get picker profile with populated pickups
export function getPickerProfile(pickerId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading profile...");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("GET", `${GET_PROFILE_API}/${pickerId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      dispatch(setPicker(response.data.picker));
      toast.dismiss(toastId);
      return response.data.picker;
    } catch (error) {
      console.log("GET_PICKER_PROFILE_API ERROR............", error);
      dispatch(setError(error.message));
      toast.dismiss(toastId);
      toast.error("Failed to load profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Get assigned pickups for picker
export function getAssignedPickups(pickerId) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("GET", `${GET_ASSIGNED_PICKUPS_API}/${pickerId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch assigned pickups");
      }

      dispatch(setAssignedPickups(response.data.pickups));
      return response.data.pickups;
    } catch (error) {
      console.log("GET_ASSIGNED_PICKUPS_API ERROR............", error);
      dispatch(setError(error.message));
      toast.error("Failed to load assigned pickups");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Get emergency pickups for picker
export function getEmergencyPickups(pickerId) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("GET", `${GET_EMERGENCY_PICKUPS_API}/${pickerId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch emergency pickups");
      }

      dispatch(setEmergencyPickups(response.data.pickups));
      return response.data.pickups;
    } catch (error) {
      console.log("GET_EMERGENCY_PICKUPS_API ERROR............", error);
      dispatch(setError(error.message));
      toast.error("Failed to load emergency pickups");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Get dashboard statistics
export function getDashboardStats(pickerId) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("GET", `${GET_DASHBOARD_STATS_API}/${pickerId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch dashboard stats");
      }

      dispatch(setDashboardStats(response.data.stats));
      return response.data.stats;
    } catch (error) {
      console.log("GET_DASHBOARD_STATS_API ERROR............", error);
      dispatch(setError(error.message));
      // Don't show toast error for stats as it's not critical
      console.error("Failed to load dashboard statistics");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Load complete dashboard data
export function loadPickerDashboard(pickerId) {
  return async (dispatch) => {
    try {
      // Load all dashboard data in parallel
      const promises = [
        dispatch(getPickerProfile(pickerId)),
        dispatch(getAssignedPickups(pickerId)),
        dispatch(getEmergencyPickups(pickerId)),
        dispatch(getDashboardStats(pickerId))
      ];

      const results = await Promise.allSettled(promises);
      
      // Check if any critical operations failed
      const failedOperations = results.filter(result => result.status === 'rejected');
      if (failedOperations.length > 0) {
        console.warn("Some dashboard operations failed:", failedOperations);
      }

      return {
        success: true,
        message: "Dashboard data loaded successfully"
      };
    } catch (error) {
      console.error("LOAD_PICKER_DASHBOARD ERROR:", error);
      toast.error("Failed to load dashboard data");
      throw error;
    }
  };
}

// Update picker profile
export function updatePickerProfile(pickerId, profileData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("PUT", `${UPDATE_PROFILE_API}/${pickerId}`, profileData);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      // Update picker in Redux store
      dispatch(setPicker(response.data.picker));
      
      toast.dismiss(toastId);
      toast.success("Profile updated successfully");
      return response.data.picker;
    } catch (error) {
      console.log("UPDATE_PICKER_PROFILE_API ERROR............", error);
      dispatch(setError(error.message));
      toast.dismiss(toastId);
      toast.error("Failed to update profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Mark pickup as successful
export function markPickupSuccessful(pickupId, isEmergency) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating pickup status...");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector("POST", COMPLETE_TASK_API, {
        type: "pickup",
        itemId: pickupId
      });
      
      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to update pickup status");
      }

      // Update pickup status in Redux store
      dispatch(updatePickupStatus({ pickupId, status: "delivered", isEmergency }));
      
      // Refresh dashboard data
      const pickerId = JSON.parse(localStorage.getItem("user"))?._id;
      if (pickerId) {
        await Promise.all([
          dispatch(getAssignedPickups(pickerId)),
          dispatch(getEmergencyPickups(pickerId)),
          dispatch(getDashboardStats(pickerId))
        ]);
      }

      toast.dismiss(toastId);
      toast.success(`Pickup marked as successful! Earned ${response.data.data.pointsEarned} points!`);
      return response.data;
    } catch (error) {
      console.log("MARK_PICKUP_SUCCESSFUL_API ERROR............", error);
      dispatch(setError(error.message));
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to update pickup status");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}
