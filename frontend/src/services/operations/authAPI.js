import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
// import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints, pickerEndpoints } from "../apis";
import { ACCOUNT_TYPE } from "../../utils/constants.jsx";
import { isPickerProfileComplete } from "../../utils/profileUtils.js";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  LOGOUT_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate, accountType = "User") {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Choose the correct API endpoint based on account type
      const apiEndpoint =
        accountType === "Picker" ? pickerEndpoints.SENDOTP_API : SENDOTP_API;

      const response = await apiConnector("POST", apiEndpoint, {
        email,
      });
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
  additionalData = {} // For picker-specific data
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Choose the correct API endpoint based on account type
      const apiEndpoint =
        accountType === "Picker" ? pickerEndpoints.SIGNUP_API : SIGNUP_API;

      const requestData = {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        ...additionalData, // Include additional data for pickers
      };

      const response = await apiConnector("POST", apiEndpoint, requestData);

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");

      dispatch(setToken(response.data.token));

      // Check if user data exists
      if (!response.data?.user) {
        console.error("No user data in response:", response.data);
        throw new Error("Invalid response: missing user data");
      }

      const userImage = response.data.user.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }));

      if (accountType === ACCOUNT_TYPE.PICKER) {
        // After picker signup, always redirect to edit profile to complete setup
        navigate("/picker-edit-profile");
      } else {
        // For regular users, navigate to the home page
        navigate("/");
      }
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      console.log("Error details:", error.message);
      console.log("Response data:", error.response?.data);
      toast.error(error.message || "Signup Failed");
      // Only navigate to signup if it's not an API success but processing error
      if (!error.message.includes("Invalid response")) {
        navigate("/signup");
      }
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate, token, accountType = "User") {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      console.log("LOGIN API CALLED WITH");

      // Choose the correct API endpoint based on account type
      const apiEndpoint =
        accountType === "Picker" ? pickerEndpoints.LOGIN_API : LOGIN_API;

      const response = await apiConnector("POST", apiEndpoint, {
        email,
        password,
        token,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));

      // Check if user data exists
      if (!response.data?.user) {
        console.error("No user data in login response:", response.data);
        throw new Error("Invalid login response: missing user data");
      }

      const userImage = response.data.user.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      
      const userWithImage = { ...response.data.user, image: userImage };
      dispatch(setUser(userWithImage));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(userWithImage));

      if (accountType === ACCOUNT_TYPE.PICKER) {
        // For pickers, check if profile is complete
        if (isPickerProfileComplete(userWithImage)) {
          navigate("/picker-profile");
        } else {
          // Profile is incomplete, redirect to edit profile
          toast.info("Please complete your profile to access all features");
          navigate("/picker-edit-profile");
        }
      } else {
        // For regular users, navigate to the home page
        navigate("/");
      }
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      console.log("Login error details:", error.message);
      console.log("Login response data:", error.response?.data);
      toast.error(error.message || "Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error);
      toast.error("Failed To Send Reset Email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESETPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    // dispatch(resetCart())
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

// API call to logout and clear cookies
export function logoutAPI(accountType = "User") {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Logging out...");
    try {
      // Choose the correct API endpoint based on account type
      const apiEndpoint = accountType === "Picker" ? pickerEndpoints.LOGOUT_API : LOGOUT_API;
      
      const response = await apiConnector("POST", apiEndpoint);

      console.log("LOGOUT API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Clear Redux state and localStorage
      dispatch(setToken(null));
      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      toast.dismiss(toastId);
      toast.success("Logged out successfully");
      return response.data;
    } catch (error) {
      console.log("LOGOUT API ERROR............", error);
      toast.dismiss(toastId);
      toast.error("Failed to logout properly");
      // Still clear local data even if API fails
      dispatch(setToken(null));
      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };
}
