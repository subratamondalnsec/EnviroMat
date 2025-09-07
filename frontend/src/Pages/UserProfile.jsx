// components/UserProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';

// Import all modular components
import ProfileHeader from '../components/core/UserProfile/ProfileHeader';
import QuickStats from '../components/core/UserProfile/QuickStats';
import CommunityActivity from '../components/core/UserProfile/CommunityActivity';
import WasteSoldTrend from '../components/core/UserProfile/WasteSoldTrend';
import SpendingHistory from '../components/core/UserProfile/SpendingHistory';
import CreditSpendingTimeline from '../components/core/UserProfile/CreditSpendingTimeline';

const UserProfile = () => {
  const pageRef = useRef(null);
  const dispatch = useDispatch();
  
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const { user } = useSelector((state) => state.profile);
  
  const [showCreditHistory, setShowCreditHistory] = useState(false);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    contentCard: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
  };

  // TODO: Replace with real API data - Sample user data
  const [userData] = useState({
    userStats: {
      name: user ? `${user.firstName} ${user.lastName}` : "User",
      userImg: user?.image || "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
      joinDate: user ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Jan 2024",
      currentCredits: 480, // TODO: Get from API
      ecoLevel: 5, // TODO: Calculate from API
      badges: 12 // TODO: Get from API
    },
    quickStats: {
      totalWasteSold: 245, // TODO: Get from API
      wasteGrowth: 15,
      totalEarned: 1250,
      earningsGrowth: 22,
      communityPosts: 18, // Static value since removing blog functionality
      postsGrowth: 8,
      totalSpent: 950,
      spendingChange: -12
    },
    communityActivity: {
      posts: 18, // Static value since removing blog functionality
      likes: 156, // Static value
      comments: 89 // Static value
    },
    wasteTrend: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      plastic: [25, 32, 28, 45, 38, 52],
      paper: [15, 22, 18, 30, 25, 35],
      metal: [8, 12, 10, 15, 18, 22]
    },
    spendingHistory: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spending: [120, 180, 150, 200, 160, 140],
      earning: [200, 250, 180, 300, 220, 280]
    }
  });

  // TODO: Replace with real API data
  const [transactionHistory] = useState([
    {
      date: '2025-01-15',
      type: 'earned',
      amount: 75,
      description: 'Plastic waste sold - 25kg recycled'
    },
    {
      date: '2025-01-12',
      type: 'spent',
      amount: 150,
      description: 'Purchased wood products'
    },
    {
      date: '2025-01-10',
      type: 'earned',
      amount: 45,
      description: 'Paper waste collection - 18kg'
    },
    {
      date: '2025-01-08',
      type: 'spent',
      amount: 90,
      description: 'Textile & fabric products'
    },
    {
      date: '2025-01-05',
      type: 'earned',
      amount: 60,
      description: 'Metal waste recycling - 15kg'
    }
  ]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleViewHistory = () => {
    setShowCreditHistory(true);
  };

  const handleCloseHistory = () => {
    setShowCreditHistory(false);
  };

  return (
    <div ref={pageRef} className={`min-h-screen ${themeStyles.background} py-8 transition-colors duration-300`}>
      {/* Background Animation */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Profile Header */}
        <ProfileHeader 
          userStats={userData.userStats} 
          onViewHistory={handleViewHistory}
        />
        
        {/* Main Content */}
        <div className={`${themeStyles.contentCard} rounded-lg shadow-sm border mb-8 transition-colors duration-300`}>
          <div className="p-6">
            <div className="space-y-8">
              {/* Quick Stats */}
              <QuickStats stats={userData.quickStats} onViewHistory={handleViewHistory} />
              
              {/* Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Community Activity */}
                <CommunityActivity activityData={userData.communityActivity} />
                
                {/* Spending History */}
                <SpendingHistory spendingData={userData.spendingHistory} />
              </div>
              
              {/* Waste Trend - Full Width */}
              <WasteSoldTrend wasteTrendData={userData.wasteTrend} />
            </div>
          </div>
        </div>

        {/* Credit Spending Timeline Modal */}
        <CreditSpendingTimeline
          isOpen={showCreditHistory}
          onClose={handleCloseHistory}
          transactions={transactionHistory}
          currentCredits={userData.userStats.currentCredits}
        />
      </div>
    </div>
  );
};

export default UserProfile;
