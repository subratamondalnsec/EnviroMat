import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, TrendingUp, Tag } from 'lucide-react';
import { getBlogStats, getBlogsByCategory, getAllBlogs } from '../../../services/operations/communityApi';
import { BLOG_CATEGORIES } from '../../../utils/constants';
import { setBlogs, setLoading } from '../../../slices/communitySlice';

const BlogFilters = ({ onFilterChange }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mostLikedBlogs, setMostLikedBlogs] = useState([]);

  const dispatch = useDispatch();

  // Theme-based styles
  const themeStyles = {
    allBtn: activeFilter === 'all'
      ? (isDarkMode ? 'bg-purple-600 text-white border-purple-500 shadow-lg' : 'bg-purple-500 text-white border-purple-400 shadow-lg')
      : (isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-purple-800 hover:text-white hover:border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400'),
    likedBtn: activeFilter === 'most-liked'
      ? (isDarkMode ? 'bg-red-600 text-white shadow-lg' : 'bg-red-400 text-white hover:text-gray-600 shadow-lg')
      : (isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-red-800 hover:border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-300'),
    categoryBtn: BLOG_CATEGORIES.includes(activeFilter)
      ? (isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg')
      : (isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-blue-800 hover:text-white hover:border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400'),
    dropdown: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200',
    dropdownItem: isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50 text-gray-900',
    activeFilterBadge: isDarkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-800',
    activeFilterClose: isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
  };

  useEffect(() => {
    // Load most liked blogs stats on component mount
    const loadStats = async () => {
      try {
        const statsData = await dispatch(getBlogStats());
        if (statsData?.data?.mostLikedBlogs) {
          setMostLikedBlogs(statsData.data.mostLikedBlogs);
        }
      } catch (error) {
        console.error('Error loading blog stats:', error);
      }
    };

    loadStats();
  }, [dispatch]);

  const handleFilterChange = async (filterType, value = null) => {
    setActiveFilter(filterType);
    setShowDropdown(false);
    
    dispatch(setLoading(true));
    
    try {
      let blogsData;
      
      if (filterType === 'most-liked') {
        const allBlogsResponse = await dispatch(getAllBlogs());
        if (allBlogsResponse?.data) {
          const sortedBlogs = [...allBlogsResponse.data]
            .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
            .slice(0, 10); // Show top 10 most liked posts
          
          onFilterChange('most-liked', sortedBlogs);
          dispatch(setLoading(false));
          return;
        }
      } else if (filterType === 'category' && value) {
        blogsData = await dispatch(getBlogsByCategory(value));
        setActiveFilter(value); // Set the specific category name as active filter
      } else {
        // 'all' - load all blogs
        onFilterChange('all');
        dispatch(setLoading(false));
        return;
      }
      
      if (blogsData?.data) {
        onFilterChange(filterType, blogsData.data);
      }
    } catch (error) {
      console.error('Error filtering blogs:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center">
      {/* All Posts Button */}
      <button
        onClick={() => handleFilterChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${themeStyles.allBtn}`}
      >
        <Filter className="w-4 h-4" />
        All Posts
      </button>

      {/* Most Liked Posts Button */}
      <button
        onClick={() => handleFilterChange('most-liked')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${themeStyles.likedBtn}`}
      >
        <TrendingUp className="w-4 h-4" />
        Most Liked ({mostLikedBlogs.length})
      </button>

      {/* Category Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${themeStyles.categoryBtn}`}
        >
          <Tag className="w-4 h-4" />
          By Category
        </button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full left-0 mt-2 w-64 ${themeStyles.dropdown} border rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto transition-colors duration-300`}
          >
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', category)}
                className={`w-full text-left px-4 py-3 ${themeStyles.dropdownItem} transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Active Filter Display */}
      {activeFilter !== 'all' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 px-3 py-1 ${themeStyles.activeFilterBadge} rounded-full text-sm transition-colors duration-300`}
        >
          <span>
            {activeFilter === 'most-liked' 
              ? 'Most Liked Posts' 
              : BLOG_CATEGORIES.includes(activeFilter)
                ? `Category: ${activeFilter}`
                : activeFilter}
          </span>
          <button
            onClick={() => handleFilterChange('all')}
            className={`ml-1 ${themeStyles.activeFilterClose} transition-colors duration-300`}
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BlogFilters;
