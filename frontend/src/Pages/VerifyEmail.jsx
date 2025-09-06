// components/VerifyEmail.jsx
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="w-full h-full absolute inset-0">
        <img src="https://images.unsplash.com/photo-1664448003365-e1b05ffd509d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTUxfHx8ZW58MHx8fHx8" alt="Verify Email Background" className="w-full h-full object-cover" />
      </div>
      
      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg font-medium">Verifying your email...</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-500 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-gray-700 font-bold text-3xl mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-700 text-base leading-relaxed">
                  We've sent a 6-digit verification code to your email address. Enter the code below to complete your registration.
                </p>
              </div>
              
              <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Enter Verification Code
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        placeholder="•"
                        style={{
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-400 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-xl font-bold text-center focus:border-gray-600 focus:outline-none transition-all duration-200"
                      />
                    )}
                    containerStyle={{
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-300 to-emerald-400 hover:bg-gradient-to-l hover:from-emerald-500 hover:to-green-400 text-gray-700 font-semibold border border-gray-400 py-4 px-6 rounded-xl transition-color duration-200 shadow-lg"
                >
                  Verify Email & Continue
                </button>
              </form>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/signup" className="group">
                  <div className="flex items-center gap-2 text-purple-400 hover:text-purple-600 transition-colors duration-200">
                    <BiArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back to Signup</span>
                  </div>
                </Link>
                <button
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-600 font-medium transition-colors duration-200 group"
                  onClick={() => dispatch(sendOtp(signupData.email, navigate, signupData.accountType))}
                >
                  <RxCountdownTimer className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Resend Code</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
