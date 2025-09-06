import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false,
}

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload
      // Save user data to localStorage
      if (value.payload) {
        localStorage.setItem("user", JSON.stringify(value.payload))
      } else {
        localStorage.removeItem("user")
      }
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
  },
})

export const { setUser, setLoading } = profileSlice.actions

export default profileSlice.reducer
