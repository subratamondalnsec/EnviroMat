// components/core/Community/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { Trophy, Crown, Award, Medal, User } from 'lucide-react';

const Leaderboard = ({ blogs }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [topUsers, setTopUsers] = useState([]);

  // Theme-based styles
  const themeStyles = {
    container: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    noDataText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    userCard: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    topUserCard: isDarkMode ? 'bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-100',
    userName: isDarkMode ? 'text-white' : 'text-gray-900',
    userStats: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    footerText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    borderColor: isDarkMode ? 'border-gray-700' : 'border-gray-100'
  };

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      // Calculate user stats based on likes
      const userStats = {};
      
      blogs.forEach(blog => {
        const userId = blog.author?._id || blog.author?.id;
        const userName = blog.author?.firstName || blog.author?.name || 'Anonymous';
        const userAvatar = blog.author?.image || blog.author?.avatar;
        const likes = blog.likes?.length || 0;
        
        if (userId) {
          if (!userStats[userId]) {
            userStats[userId] = {
              id: userId,
              name: userName,
              avatar: userAvatar,
              totalLikes: 0,
              posts: 0
            };
          }
          userStats[userId].totalLikes += likes;
          userStats[userId].posts += 1;
        }
      });

      // Sort users by total likes and get top 10
      const sortedUsers = Object.values(userStats)
        .sort((a, b) => b.totalLikes - a.totalLikes)
        .slice(0, 10)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
          credits: index === 0 ? 30 : index === 1 ? 20 : index === 2 ? 10 : 0
        }));

      setTopUsers(sortedUsers);
    }
  }, [blogs]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Medal className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white';
      default:
        return isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  if (topUsers.length === 0) {
    return (
      <div className={`${themeStyles.container} rounded-2xl p-6 shadow-sm border h-fit sticky top-6 transition-colors duration-300`}>
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-purple-500" />
          <h2 className={`text-xl font-bold ${themeStyles.heading} transition-colors duration-300`}>Leaderboard</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🏆</div>
          <p className={`${themeStyles.noDataText} transition-colors duration-300`}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeStyles.container} rounded-2xl p-6 shadow-sm border h-fit sticky top-21 transition-colors duration-300`}>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-purple-500" />
        <h2 className={`text-xl font-bold ${themeStyles.heading} transition-colors duration-300`}>Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              user.rank <= 3 
                ? `${themeStyles.topUserCard} border` 
                : themeStyles.userCard
            }`}
          >
            {/* Rank Badge */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(user.rank)}`}>
              {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
            </div>

            {/* User Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-green-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              {user.rank <= 3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-yellow-900">★</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${themeStyles.userName} truncate text-sm transition-colors duration-300`}>
                {user.name}
              </p>
              <div className={`flex items-center gap-2 text-xs ${themeStyles.userStats} transition-colors duration-300`}>
                <span>💝 {user.totalLikes} likes</span>
                <span>•</span>
                <span>📝 {user.posts} posts</span>
              </div>
            </div>

            {/* Credits Badge */}
            {user.credits > 0 && (
              <div className={`${isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300`}>
                +{user.credits}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t ${themeStyles.borderColor} text-center transition-colors duration-300`}>
        <p className={`text-xs ${themeStyles.footerText} transition-colors duration-300`}>
          Rankings based on total likes received
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
