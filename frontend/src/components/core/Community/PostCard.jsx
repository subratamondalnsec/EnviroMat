// components/PostCard.jsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {FaHeart, FaRegHeart, FaComment, FaRegComment} from 'react-icons/fa'
import { MessageCircle, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { toggleLikeBlog, addCommentToBlog, deleteBlog } from '../../../services/operations/communityApi';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const PostCard = ({ post, onLike, onAddComment, refSetter, onViewDetails, onEditPost }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile || {});

  const isAuthor = user && user._id === post.author?._id;

  // Theme-based styles
  const themeStyles = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    authorText: 'text-purple-500',
    dateBg: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700',
    dropdownBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200',
    dropdownHover: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50',
    commentBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    inputBg: isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900',
    buttonBg: isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await dispatch(toggleLikeBlog(post._id));
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(post._id));
      setShowDropdown(false);
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    setShowDropdown(false);
    if (onViewDetails) {
      onViewDetails(post._id);
    }
  };

  const handleEdit = () => {
    setShowDropdown(false);
    if (onEditPost) {
      onEditPost(post);
    }
  };

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if(!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      await dispatch(addCommentToBlog(post._id, commentText.trim()));
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = date => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const shortDescription = post.content && post.content.length > 150 ? post.content.slice(0,150) + '...' : (post.content || '');

  const comments = post.comments || [];
  const commentsToShow = showAllComments ? comments : comments.slice(0,2);

  return (
    <motion.div
      ref={refSetter}
      className={`${themeStyles.cardBg} rounded-3xl shadow p-6 border hover:shadow-md transition-colors duration-300 relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-4">
        <div className={`flex justify-between ${themeStyles.textSecondary} text-md mb-4 transition-colors duration-300`}>
          <div className={`flex items-center ${themeStyles.authorText}`}>
            <img 
              src={post.author?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.firstName || 'A'}%20${post.author?.lastName || 'U'}`} 
              alt={`${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'User'} 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span>{`${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Anonymous User'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span className="transition-colors duration-300">{formatDate(post.createdAt)}</span>
              {post.category && (
                <span className={`text-xs ${themeStyles.dateBg} px-2 py-1 rounded-full mt-1 transition-colors duration-300`}>
                  {post.category}
                </span>
              )}
            </div>
            
            {/* Three Dots Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-300`}
                aria-label="Post options"
              >
                <MoreVertical className={`w-4 h-4 ${themeStyles.textSecondary}`} />
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 top-full mt-1 w-48 ${themeStyles.dropdownBg} border rounded-lg shadow-lg z-10 transition-colors duration-300`}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {/* View Full Post - Available for everyone */}
                  <button
                    onClick={handleViewDetails}
                    className={`w-full flex items-center space-x-2 px-4 py-3 text-left ${themeStyles.dropdownHover} transition-colors duration-300`}
                  >
                    <Eye className="w-4 h-4 text-green-500" />
                    <span className="transition-colors duration-300">View Full Post</span>
                  </button>

                  {/* Edit and Delete options - Only for post author */}
                  {isAuthor && (
                    <>
                      <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}></div>
                      <button
                        onClick={handleEdit}
                        className={`w-full flex items-center space-x-2 px-4 py-3 text-left ${themeStyles.dropdownHover} transition-colors duration-300`}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                        <span className="transition-colors duration-300">Edit Post</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`w-full flex items-center space-x-2 px-4 py-3 text-left ${themeStyles.dropdownHover} transition-colors duration-300 text-red-600`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <h3 className={`text-lg font-semibold mb-1 ${themeStyles.textPrimary} transition-colors duration-300`}>{post.title}</h3>
        <p className={`${themeStyles.textSecondary} leading-relaxed transition-colors duration-300`}>{shortDescription}</p>
      </div>

      {post.image && (
        <div className="overflow-hidden rounded-2xl mb-4">
          <img src={post.image} alt={post.title} className="w-full object-cover hover:scale-101 transition" />
        </div>
      )}

      <div className={`flex gap-6 mb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-3 transition-colors duration-300`}>
        <button
          className={`inline-flex items-center space-x-2 group ${isLiking ? 'opacity-50' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          {(post.likesCount || 0) > 0 ? (
            <FaHeart className="w-5 h-5 text-red-500 group-hover:scale-110 transition" />
          ) : (
            <FaRegHeart className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-red-500 group-hover:scale-110 transition`} />
          )}
          <span className={(post.likesCount || 0) > 0 ? 'text-red-500' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{post.likesCount || 0}</span>
        </button>
        <div className="inline-flex items-center space-x-1">
          {(post.commentsCount || comments.length || 0) > 0 ? (
            <MessageCircle className="w-5 h-5 text-blue-500" />
          ) : (
            <MessageCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          )}
          <span className={(post.commentsCount || comments.length || 0) > 0 ? 'text-blue-500' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {post.commentsCount || (comments.length || 0)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {comments.slice(0, showAllComments ? undefined : 2).map((commentObj, idx) => (
          <div key={idx} className={`${themeStyles.commentBg} rounded-xl p-3 text-sm transition-colors duration-300`}>
            <div className="flex items-center space-x-2 mb-1">
              <img 
                src={commentObj.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${commentObj.user?.firstName || 'A'}%20${commentObj.user?.lastName || 'U'}`} 
                alt="Commenter" 
                className="w-6 h-6 rounded-full"
              />
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                {`${commentObj.user?.firstName || ''} ${commentObj.user?.lastName || ''}`.trim() || 'Anonymous User'}
              </span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{commentObj.comment}</p>
          </div>
        ))}

        {comments.length > 2 && (
          <button
            className="text-green-600 text-sm font-semibold"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Show less' : `View all ${comments.length} comments`}
          </button>
        )}

        <form onSubmit={onSubmitComment} className="flex space-x-2 mt-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className={`flex-grow ${themeStyles.inputBg} border rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300`}
            placeholder="Write a comment..."
            maxLength={200}
          />
          <button
            type="submit"
            className={`${themeStyles.buttonBg} text-white px-4 rounded-xl transition-colors duration-300 ${isCommenting || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isCommenting || !commentText.trim()}
          >
            {isCommenting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PostCard;
