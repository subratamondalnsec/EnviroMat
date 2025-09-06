import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { X, Camera } from 'lucide-react';
import { editBlog } from '../../../services/operations/communityApi';
import { updateBlog } from '../../../slices/communitySlice';
import { BLOG_CATEGORIES } from '../../../utils/constants';
import toast from 'react-hot-toast';

const EditPostModal = ({ show, onClose, post }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Environment');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepExistingImage, setKeepExistingImage] = useState(true);

  const dispatch = useDispatch();
  const modalRef = useRef(null);

  useEffect(() => {
    if (show && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setCategory(post.category || 'Environment');
      setImagePreview(post.image || null);
      setKeepExistingImage(true);
      setImageFile(null);
    }
  }, [show, post]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setKeepExistingImage(false);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setKeepExistingImage(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Environment');
    setImageFile(null);
    setImagePreview(null);
    setKeepExistingImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!keepExistingImage && !imageFile) {
      toast.error('Please select an image for your post');
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        category,
        status: 'published'
      };

      // Only include image if user selected a new one
      if (!keepExistingImage && imageFile) {
        blogData.image = imageFile;
      }

      const response = await dispatch(editBlog(post._id, blogData));
      
      if (response?.data) {
        // Update the blog in Redux state
        dispatch(updateBlog(response.data));
        toast.success('Post updated successfully!');
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !post) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-[#f5f5f5] rounded-3xl p-8 max-w-xl w-full overflow-hidden relative mt-16 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-title">
              Post Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter your post title"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-category">
              Category *
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-content">
              Content *
            </label>
            <textarea
              id="edit-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition"
              placeholder="Write your blog content here"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Image
            </label>
            
            {/* Keep existing image option */}
            {post.image && (
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="imageOption"
                    checked={keepExistingImage}
                    onChange={() => {
                      setKeepExistingImage(true);
                      setImageFile(null);
                      setImagePreview(post.image);
                    }}
                    className="text-green-600"
                  />
                  <span>Keep existing image</span>
                </label>
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="imageOption"
                  checked={!keepExistingImage}
                  onChange={() => {
                    setKeepExistingImage(false);
                    if (!imageFile) {
                      setImagePreview(null);
                    }
                  }}
                  className="text-green-600"
                />
                <span>Upload new image</span>
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-600 transition cursor-pointer relative">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg"
                  />
                  {!keepExistingImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      aria-label="Remove image"
                    >
                      <X size={20} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="edit-image" className="flex flex-col items-center justify-center cursor-pointer">
                    <Camera size={36} className="text-gray-400 mb-2" />
                    <span className="text-green-600 hover:underline">Upload an image</span>
                    <span className="text-sm text-gray-500 mt-1">JPG, PNG, WebP or GIF</span>
                  </label>
                  <input
                    id="edit-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={onImageChange}
                    className="hidden"
                    disabled={keepExistingImage}
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditPostModal;
