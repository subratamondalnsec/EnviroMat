import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import communityReducer from "../slices/communitySlice"
import pickerReducer from "../slices/pickerSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  community: communityReducer,
  picker: pickerReducer,
})

export default rootReducer
