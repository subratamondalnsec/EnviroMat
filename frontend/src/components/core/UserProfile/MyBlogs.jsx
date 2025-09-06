import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit, 
  Trash2,
  Plus,
  Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import community API
import { getMyBlogs, deleteBlog } from '../../../services/operations/communityApi';

const MyBlogs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft

  // Fetch user's blogs
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getMyBlogs());
        setBlogs(response.blogs || []);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        toast.error('Failed to load your blogs');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyBlogs();
    }
  }, [dispatch, user]);

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await dispatch(deleteBlog(blogId));
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Failed to delete blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    return blog.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Blogs</h2>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Blogs</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
          
          {/* Create New Blog Button */}
          <button
            onClick={() => {
              // TODO: Navigate to create blog page
              toast.success('Navigate to create blog page');
            }}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
          <div className="text-sm text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter(blog => blog.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {blogs.filter(blog => blog.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Edit className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {filter === 'all' ? 'No blogs yet' : `No ${filter} blogs`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Start sharing your environmental knowledge with the community!'
              : `You don't have any ${filter} blogs at the moment.`
            }
          </p>
          <button
            onClick={() => {
              // TODO: Navigate to create blog page
              toast.success('Navigate to create blog page');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Write Your First Blog
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                        {blog.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>

                    {/* Category */}
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {blog.category}
                    </span>

                    {/* Content Preview */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateContent(blog.content)}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {blog.publishedAt ? formatDate(blog.publishedAt) : formatDate(blog.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{blog.likes?.length || 0} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{blog.comments?.length || 0} comments</span>
                      </div>
                      {blog.image && (
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blog Image */}
                  {blog.image && (
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        // TODO: Navigate to view blog page
                        toast.success('Navigate to view blog');
                      }}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Navigate to edit blog page
                        toast.success('Navigate to edit blog');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
