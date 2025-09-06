import React, { useEffect, useRef, useState } from "react";
import { User, Search, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";

// Import custom components
import Logo from "./NavbarComponents/Logo";
import CoinButton from "./NavbarComponents/CoinButton";
import NavigationLinks from "./NavbarComponents/NavigationLinks";
import UserDropdown from "./NavbarComponents/UserDropdown";

// Import logout thunk
import { logoutUser } from "../../slices/authSlice";

const Navbar = () => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const iconButtonsRef = useRef([]);
  const navButtonsRef = useRef([]);
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication state from Redux store
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const isAuthenticated = !!token;

  // Add elements to refs arrays
  const addToIconButtonsRefs = (el, index) => {
    if (el && !iconButtonsRef.current.includes(el)) {
      iconButtonsRef.current[index] = el;
    }
  };

  const addToNavButtonsRefs = (el, index) => {
    if (el && !navButtonsRef.current.includes(el)) {
      navButtonsRef.current[index] = el;
    }
  };

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
      // Get account type from user data, default to "User" if not found
      const accountType = user?.accountType || "User";
      await dispatch(logoutUser({ accountType, navigate })).unwrap();
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

  useEffect(() => {
    const logo = logoRef.current;
    const iconButtons = iconButtonsRef.current.filter(Boolean);
    const navButtons = navButtonsRef.current.filter(Boolean);

    // More dramatic initial states
    gsap.set(logo, {
      y: -80,
      opacity: 0,
      scale: 0.5,
      rotation: -15,
    });

    gsap.set(iconButtons, {
      y: -100,
      opacity: 0,
      scale: 0.5,
      rotation: -45,
    });

    gsap.set(navButtons, {
      y: -60,
      opacity: 0,
      scale: 0.5,
      rotationY: 45,
    });

    // Enhanced timeline with more dramatic effects
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(logo, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "back.out(1.7)",
    })
      .to(
        iconButtons,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(2.5)",
        },
        "-=0.6"
      )
      .to(
        navButtons,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header
      ref={navbarRef}
      className="bg-transparent fixed top-[10px] left-0 right-0 w-full z-50"
    >
      <div className="max-w-full mx-auto px-9 lg:px-9">
        <div className="flex justify-between items-center h-20">
          <Logo logoRef={logoRef} />
          <NavigationLinks addToNavButtonsRefs={addToNavButtonsRefs} />

          {/* Right side icons */}
          <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm px-2 py-[0.4rem] rounded-full">
            {/* Authentication-based buttons */}
            {isAuthenticated ? (
              <>
                <CoinButton addToIconButtonsRefs={addToIconButtonsRefs} />

                {/* User Profile Dropdown when authenticated */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    ref={(el) => addToIconButtonsRefs(el, 1)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#F9FAFB] backdrop-blur-xl w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors transform-gpu"
                  >
                    <User className="w-5 h-5 text-gray-600" />
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
              </>
            ) : (
              // Sign Up and Login buttons when not authenticated
              <>
                <motion.button
                  ref={(el) => addToIconButtonsRefs(el, 1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/signup")}
                  className="bg-[#F9FAFB] backdrop-blur-xl px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-[#eff8d8] hover:border-[#08DF73] transition-colors transform-gpu"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  ref={(el) => addToIconButtonsRefs(el, 2)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/login")}
                  className="bg-[#0ae979] backdrop-blur-xl px-4 py-2 border border-[#08DF73] rounded-full text-sm font-medium text-gray-600 hover:bg-[#eff8d8] transition-colors transform-gpu"
                >
                  Login
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
