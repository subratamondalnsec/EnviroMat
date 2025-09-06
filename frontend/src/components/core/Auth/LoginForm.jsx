import React from "react";
import {motion} from "motion/react";
import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI";
import { ACCOUNT_TYPE } from "../../../utils/constants.jsx"
import Tab from "./Tab"

export default function LoginForm() {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData, "Account type:", accountType);
    
    dispatch(login(email, password, navigate, null, accountType))
  }

  const tabData = [
    {
      id: 1,
      tabName: "User",
      type: ACCOUNT_TYPE.USER,
    },
    {
      id: 2,
      tabName: "Picker",
      type: ACCOUNT_TYPE.PICKER,
    },
  ]

  return (
    <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-500 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-gray-700 font-bold text-3xl mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          Login to access your account and enjoy our services.
        </p>
      </div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

        <form
        onSubmit={handleOnSubmit}
        className="space-y-6"
      >
        <div className="space-y-4">
          <label className="block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              Email Address <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 pr-12 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
            />
          </label>
          <label className="relative block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              Password <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full px-4 py-3 pr-12 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[42px] z-[10] cursor-pointer text-green-600 hover:text-green-700 transition-colors"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={20} />
              ) : (
                <AiOutlineEye fontSize={20} />
              )}
            </span>
            <Link to="/forgot-password">
              <p className="mt-2 text-sm text-purple-400 hover:text-purple-600 transition-colors duration-200 text-right">
                Forgot Password?
              </p>
            </Link>
          </label>
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-green-300 to-emerald-400 hover:bg-gradient-to-l hover:from-emerald-500 hover:to-green-400 text-gray-700 font-semibold border border-gray-400 py-4 px-6 rounded-xl transition-color duration-200 shadow-lg"

        >
          Log In
        </motion.button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-gray-700 text-base">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:text-purple-600 font-semibold hover:text-bold transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
