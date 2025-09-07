// components/CreatePostModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { createBlog } from '../../../services/operations/communityApi';
import { addBlog, setLoading } from '../../../slices/communitySlice';
import { BLOG_CATEGORIES } from '../../../utils/constants';
import toast, { Toaster } from "react-hot-toast";

const CreatePostModal = ({ show, onClose, onCreate }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Environment');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const modalRef = useRef(null);

  // Blog categories from backend schema
  const categories = BLOG_CATEGORIES;

  // Theme-based styles
  const themeStyles = {
    overlay: 'bg-black/20 backdrop-blur-sm',
    modal: isDarkMode ? 'bg-gray-800' : 'bg-[#f5f5f5]',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    label: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    textarea: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    uploadArea: isDarkMode ? 'border-gray-600 hover:border-green-400' : 'border-gray-300 hover:border-green-600',
    cancelBtn: isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    submitBtn: isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700',
    closeBtn: isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  };

  useEffect(() => {
    if (show) {
      gsap.fromTo(modalRef.current, {scale: 0.8, opacity: 0}, {scale:1, opacity:1, duration:0.4, ease:'power2.out'});
    }
  }, [show]);

  const onImageChange = e => {
    const file = e.target.files[0];
    if(file){
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Environment');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title.trim() || !content.trim()){
      toast.error('Please fill in title and content');
      return;
    }
    
    if (!imageFile) {
      toast.error('Please select an image for your blog post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        image: imageFile,
        status: 'published'
      };

      const result = await dispatch(createBlog(blogData));
      
      if (result?.data) {
        dispatch(addBlog(result.data));
        onCreate && onCreate(result.data);
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if(!show) return null;

  return (
    <motion.div
      className={`createPost fixed inset-0 z-50 flex items-center justify-center ${themeStyles.overlay}`}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
    >
      <motion.div
        ref={modalRef}
        className={`${themeStyles.modal} rounded-3xl p-8 max-w-xl w-full overflow-hidden relative mt-16 transition-colors duration-300`}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-6 right-6 p-2 ${themeStyles.closeBtn} rounded-full transition-colors duration-300`}
        >
          <X size={24} />
        </button>

        <h2 className={`text-2xl font-bold mb-6 ${themeStyles.heading} transition-colors duration-300`}>Create a New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`} htmlFor="title">Post Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300`}
              placeholder="Enter your post title"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`} htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`w-full px-4 py-3 border ${themeStyles.input} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300`}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`} htmlFor="content">Content *</label>
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              className={`w-full px-4 py-3 border ${themeStyles.textarea} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition-all duration-300`}
              placeholder="Write your blog content here"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-2 transition-colors duration-300`} htmlFor="image">Add Image (required)</label>
            <div className={`border-2 border-dashed ${themeStyles.uploadArea} rounded-lg p-6 text-center transition-all duration-300 cursor-pointer relative`}>
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    aria-label="Remove image"
                  ><X size={20}/></button>
                </>
              ) : (
                <>
                  <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                    <Camera size={36} className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                    <span className="text-green-600 hover:underline">Upload an image</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>JPG, PNG, WebP or GIF</span>
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={onImageChange}
                    className="hidden"
                    required
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-lg ${themeStyles.cancelBtn} transition-colors duration-300`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg ${themeStyles.submitBtn} disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Submit Post"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
