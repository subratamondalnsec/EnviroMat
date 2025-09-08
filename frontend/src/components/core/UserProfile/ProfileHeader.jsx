// components/profile/ProfileHeader.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Coins, Leaf, Award } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

const ProfileHeader = ({ userStats, onViewHistory }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={headerRef} className={`${isDarkMode ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-green-500 to-emerald-600'} rounded-3xl p-8 text-white mb-8 transition-all duration-300`}>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
          <div className="bg-white bg-opacity-20 rounded-full p-1">
            <img src={userStats.userImg} alt={userStats.name} className="w-24 h-24 rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userStats.name}</h1>
            <p className="text-green-100 text-lg">Eco Warrior since {userStats.joinDate}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Leaf className="w-4 h-4" />
                <span className="text-sm">Level {userStats.ecoLevel}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span className="text-sm">{userStats.badges} Badges</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-15 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coins className="w-8 h-8 text-yellow-500" />
            <span className="text-purple-500 text-4xl font-bold tracking-tight">{userStats.currentCredits}</span>
          </div>
          <p className="text-purple-400 text-sm">Current Credits</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewHistory}
            className={`mt-4 ${isDarkMode ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-green-100 text-green-600 hover:bg-green-200'} px-6 py-2 rounded-full font-semibold transition-colors duration-300`}
          >
            View History
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
