import React, { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";

// Import custom components
import UserDropdown from "./NavbarComponents/UserDropdown";

// Import logout thunk
import { logout } from "../../services/operations/authAPI";
import { ACCOUNT_TYPE } from "../../utils/constants.jsx";
import { isPickerProfileComplete } from "../../utils/profileUtils.js";

const PickerNavbar = () => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const userButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication state from Redux store
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const isAuthenticated = !!token;

  // Check if profile is complete
  const profileComplete = isAuthenticated && user && isPickerProfileComplete(user);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      dispatch(logout(navigate));
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      setIsDropdownOpen(false);
    }
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  // Handle logo click based on account type
  const handleLogoClick = () => {
    if (user?.accountType === ACCOUNT_TYPE.PICKER) {
      navigate('/pickup-dashboard');
    } else {
      navigate('/');
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (!profileComplete) return;

    const logo = logoRef.current;
    const userButton = userButtonRef.current;

    // Initial states
    gsap.set([logo, userButton], {
      y: -50,
      opacity: 0,
      scale: 0.8,
    });

    // Animation timeline
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(logo, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
    .to(userButton, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [profileComplete]);

  // Don't render navbar if profile is incomplete
  if (!profileComplete) {
    return null;
  }

  return (
    <header
      ref={navbarRef}
      className="bg-transparent fixed top-[10px] left-0 right-0 w-full z-50"
    >
      <div className="max-w-full mx-auto px-9 lg:px-9">
        <div className="flex justify-between items-center h-20">
          {/* Company Logo */}
          <motion.button
            ref={logoRef}
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#f9fafb4f] backdrop-blur-xl rounded-full px-2 py-[6px] transform-gpu hover:bg-[#f9fafb8f] transition-colors duration-200"
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <img src="/Logo.png" alt="Logo" className="w-4 h-4" />
            </div>
            <span className="text-[18px] font-[500] tracking-tight text-gray-900">
              EnviroMat
            </span>
          </motion.button>

          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm px-2 py-[0.4rem] rounded-full">
            <div className="relative" ref={dropdownRef}>
              <motion.button
                ref={userButtonRef}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#F9FAFB] backdrop-blur-xl w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors transform-gpu"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              <UserDropdown
                isOpen={isDropdownOpen}
                dropdownRef={dropdownRef}
                user={user}
                isAuthenticated={isAuthenticated}
                handleNavigation={handleNavigation}
                handleLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PickerNavbar;
