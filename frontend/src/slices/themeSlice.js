// slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('darkMode') 
    ? JSON.parse(localStorage.getItem('darkMode')) 
    : false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.isDarkMode));
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.isDarkMode));
    }
  }
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
