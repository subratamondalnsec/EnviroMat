import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  picker: localStorage.getItem("picker") ? JSON.parse(localStorage.getItem("picker")) : null,
  assignedPickups: [],
  emergencyPickups: [],
  dashboardStats: {
    totalPickups: 0,
    completedPickups: 0,
    pendingPickups: 0,
    totalEarnings: 0,
    monthlyData: {
      days: [],
      pickups: [],
      wasteTypes: []
    }
  },
  loading: false,
  error: null,
}

const pickerSlice = createSlice({
  name: "picker",
  initialState: initialState,
  reducers: {
    setPicker(state, action) {
      state.picker = action.payload
      // Save picker data to localStorage
      if (action.payload) {
        localStorage.setItem("picker", JSON.stringify(action.payload))
      } else {
        localStorage.removeItem("picker")
      }
    },
    setAssignedPickups(state, action) {
      state.assignedPickups = action.payload
    },
    setEmergencyPickups(state, action) {
      state.emergencyPickups = action.payload
    },
    setDashboardStats(state, action) {
      state.dashboardStats = { ...state.dashboardStats, ...action.payload }
    },
    addNewPickup(state, action) {
      const { pickup, isEmergency } = action.payload
      if (isEmergency) {
        state.emergencyPickups.unshift(pickup)
      } else {
        state.assignedPickups.unshift(pickup)
      }
    },
    updatePickupStatus(state, action) {
      const { pickupId, status, isEmergency } = action.payload
      const pickups = isEmergency ? state.emergencyPickups : state.assignedPickups
      const pickupIndex = pickups.findIndex(pickup => pickup._id === pickupId)
      if (pickupIndex !== -1) {
        pickups[pickupIndex].pickupStatus = status
      }
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
    resetPickerState(state) {
      state.picker = null
      state.assignedPickups = []
      state.emergencyPickups = []
      state.dashboardStats = initialState.dashboardStats
      state.loading = false
      state.error = null
      localStorage.removeItem("picker")
    }
  },
})

export const { 
  setPicker, 
  setAssignedPickups, 
  setEmergencyPickups, 
  setDashboardStats,
  addNewPickup,
  updatePickupStatus,
  setLoading, 
  setError,
  clearError,
  resetPickerState
} = pickerSlice.actions

export default pickerSlice.reducer
