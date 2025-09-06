import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import rootReducer from "./reducer/index.js";
import { configureStore } from "@reduxjs/toolkit";



const store=configureStore({
  reducer: rootReducer,
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
