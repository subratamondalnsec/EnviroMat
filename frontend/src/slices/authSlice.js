import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { endpoints, pickerEndpoints } from "../services/apis";
import { setUser } from "./profileSlice";
import { ACCOUNT_TYPE } from "../utils/constants.jsx";
import { isPickerProfileComplete } from "../utils/profileUtils.js";

const { LOGIN_API, LOGOUT_API } = endpoints;

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, accountType = "User", navigate }, { dispatch, rejectWithValue }) => {
    const toastId = toast.loading("Logging in...");
    try {
      // Choose the correct API endpoint based on account type
      console.log("LOGIN API CALLED WITH:", { email, password, accountType });
      const apiEndpoint = accountType === "Picker" ? pickerEndpoints.LOGIN_API : LOGIN_API;

      const response = await apiConnector("POST", apiEndpoint, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user } = response.data;
      
      // Set user image if not provided
      const userImage = user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
      const userWithImage = { ...user, image: userImage };
      
      // Store token and user in localStorage
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(userWithImage));
      
      // Dispatch setUser action
      dispatch(setUser(userWithImage));
      
      toast.dismiss(toastId);
      toast.success("Login successful");
      console.log(user.accountType);
      
      // Role-based navigation with profile completeness check
      if (user.accountType === ACCOUNT_TYPE.PICKER) {
        // For pickers, check if profile is complete
        if (isPickerProfileComplete(userWithImage)) {
          console.log("Picker profile is complete");
          navigate("/picker-profile");
        } else {
          // Profile is incomplete, redirect to edit profile
          toast.info("Please complete your profile to access all features");
          navigate("/picker-edit-profile");
        }
      } else {
        navigate("/");
      }

      return { token, user: userWithImage };
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Login failed");
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async ({ accountType = "User", navigate }, { dispatch, rejectWithValue }) => {
    const toastId = toast.loading("Logging out...");
    try {
      // Choose the correct API endpoint based on account type
      const apiEndpoint = accountType === "Picker" ? pickerEndpoints.LOGOUT_API : LOGOUT_API;
      
      const response = await apiConnector("POST", apiEndpoint);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear user from profile slice
      dispatch(setUser(null));
      
      toast.dismiss(toastId);
      toast.success("Logged out successfully");
      
      // Navigate to home
      navigate("/");

      return response.data;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to logout properly");
      
      // Still clear local data even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setUser(null));
      
      navigate("/");
      
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.signupData = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.signupData = null;
      });
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
