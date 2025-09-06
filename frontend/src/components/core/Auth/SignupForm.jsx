// components/core/Auth/SignupForm.jsx
import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ACCOUNT_TYPE } from "../../../utils/constants.jsx"
import Tab from "./Tab";
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"

export default function SignupForm() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    const signupData = {
      ...formData,
      accountType,
    }
    dispatch(setSignupData(signupData))
    dispatch(sendOtp(formData.email, navigate, accountType))

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.USER)
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-gray-700 font-bold text-3xl mb-2">
          Create Account
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          Join our eco-conscious community today
        </p>
      </div>

      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form onSubmit={handleOnSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              First Name <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="w-full px-4 py-3 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
            />
          </label>
          <label className="block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              Last Name <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="w-full px-4 py-3 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
            />
          </label>
        </div>
        
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
            className="w-full px-4 py-3 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
          />
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="relative block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              Create Password <sup className="text-red-500">*</sup>
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
          </label>
          <label className="relative block">
            <p className="mb-2 text-gray-700 text-sm font-medium">
              Confirm Password <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 pr-12 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-base focus:border-gray-600 focus:outline-none transition-all duration-200"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[42px] z-[10] cursor-pointer text-green-600 hover:text-green-700 transition-colors"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={20} />
              ) : (
                <AiOutlineEye fontSize={20} />
              )}
            </span>
          </label>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-green-300 to-emerald-400 hover:bg-gradient-to-l hover:from-emerald-500 hover:to-green-400 text-gray-700 font-semibold border border-gray-400 py-4 px-6 rounded-xl transition-color duration-200 shadow-lg"
        >
          Create Account
        </motion.button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-700 text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-600 font-semibold hover:text-bold transition-colors duration-200">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
