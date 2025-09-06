import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { pickerEndpoints, userEndpoints } from "../apis";
import { setUser, setLoading } from "../../slices/profileSlice";

const { GET_PROFILE_API: PICKER_PROFILE_API, UPDATE_PROFILE_API: PICKER_UPDATE_API } = pickerEndpoints;
const { GET_PROFILE_API: USER_PROFILE_API, UPDATE_PROFILE_API: USER_UPDATE_API } = userEndpoints;

// Get picker profile
export function getPickerProfile(pickerId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading profile...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", `${PICKER_PROFILE_API}/${pickerId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      toast.dismiss(toastId);
      return response.data.picker;
    } catch (error) {
      console.log("GET_PICKER_PROFILE_API ERROR............", error);
      toast.dismiss(toastId);
      toast.error("Failed to load profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Update picker profile
export function updatePickerProfile(pickerId, profileData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", `${PICKER_UPDATE_API}/${pickerId}`, profileData);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      // Update user in Redux store
      dispatch(setUser(response.data.picker));
      
      toast.dismiss(toastId);
      toast.success("Profile updated successfully");
      return response.data.picker;
    } catch (error) {
      console.log("UPDATE_PICKER_PROFILE_API ERROR............", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Get user profile
export function getUserProfile(userId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading profile...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", `${USER_PROFILE_API}/${userId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      toast.dismiss(toastId);
      return response.data.user;
    } catch (error) {
      console.log("GET_USER_PROFILE_API ERROR............", error);
      toast.dismiss(toastId);
      toast.error("Failed to load profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Update user profile
export function updateUserProfile(userId, profileData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", `${USER_UPDATE_API}/${userId}`, profileData);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      // Update user in Redux store
      dispatch(setUser(response.data.user));
      
      toast.dismiss(toastId);
      toast.success("Profile updated successfully");
      return response.data.user;
    } catch (error) {
      console.log("UPDATE_USER_PROFILE_API ERROR............", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}
