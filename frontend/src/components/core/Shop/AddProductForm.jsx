// components/AddProductForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Camera } from 'lucide-react';
import gsap from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createOrder } from '../../../services/operations/orderAPI';
import { setOrderLoading } from '../../../slices/orderSlice';
import { ITEM_CATEGORIES } from '../../../utils/constants';

const AddProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = ITEM_CATEGORIES
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.order);
  
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [formData, setFormData] = useState({
    image: '',
    category: categories[0] || 'Recycled Plastic Products',
    title: '',
    description: '',
    price: '',
    quantity: '',
    address: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  // Theme-based styles
  const themeStyles = {
    overlay: 'bg-black/50 backdrop-blur-sm',
    modal: isDarkMode ? 'bg-gray-800' : 'bg-white',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    label: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-600',
    helperText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    uploadArea: isDarkMode ? 'border-gray-600 hover:border-green-400' : 'border-gray-300 hover:border-green-600',
    uploadIcon: isDarkMode ? 'text-gray-500' : 'text-gray-400',
    uploadText: isDarkMode ? 'text-green-400' : 'text-green-600',
    cancelBtn: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    submitBtn: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400',
    closeBtn: isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  };

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current, {scale: 0.8, opacity: 0}, {scale:1, opacity:1, duration:0.4, ease:'power2.out'});
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxWidth = 800;
          const maxHeight = 600;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData(prev => ({
            ...prev,
            image: compressedDataUrl
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to add products');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim() || !formData.quantity.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 5 || formData.title.length > 20) {
      toast.error('Product title must be between 5 and 20 characters');
      return;
    }

    if (formData.description.length < 25 || formData.description.length > 50) {
      toast.error('Product description must be between 25 and 50 characters');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 50) {
      toast.error('Price must be at least ₹50');
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (!formData.image) {
      toast.error('Please select an image for your product');
      return;
    }

    setIsSubmitting(true);
    dispatch(setOrderLoading(true));

    try {
      const orderData = {
        product: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: price,
          quantity: quantity,
          category: formData.category
        },
        image: {
          tempFilePath: formData.image
        },
        address: formData.address.trim()
      };

      const createdOrder = await createOrder(orderData);
      onSubmit && onSubmit(createdOrder);
      toast.success('Product added successfully!');
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
      dispatch(setOrderLoading(false));
    }
  };

  const resetForm = () => {
    setFormData({
      image: '',
      category: categories[0] || 'Recycled Plastic Products',
      title: '',
      description: '',
      price: '',
      quantity: '',
      address: ''
    });
    setImageFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${themeStyles.overlay} p-6`}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <motion.div
        ref={modalRef}
        className={`${themeStyles.modal} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative transition-colors duration-300`}
      >
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 p-2 ${themeStyles.closeBtn} rounded-full transition-colors duration-300`}
        >
          <X size={20} />
        </button>

        <h2 className={`text-xl font-bold mb-6 ${themeStyles.heading} transition-colors duration-300`}>Add New Product</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Two Column Layout for Better Space Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Title */}
            <div>
              <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="title">
                Title * (5-20 chars)
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300`}
                placeholder="Product title"
                minLength={5}
                maxLength={20}
                required
              />
              <p className={`text-xs ${themeStyles.helperText} mt-1 transition-colors duration-300`}>{formData.title.length}/20</p>
            </div>

            {/* Product Category */}
            <div>
              <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300`}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="description">
              Description * (25-50 chars)
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent resize-none transition-all duration-300`}
              placeholder="Product description"
              minLength={25}
              maxLength={50}
              required
            />
            <p className={`text-xs ${themeStyles.helperText} mt-1 transition-colors duration-300`}>{formData.description.length}/50</p>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="price">
                Price (₹) * (Min 50)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300`}
                placeholder="50"
                min="50"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="quantity">
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300`}
                placeholder="1"
                min="1"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border ${themeStyles.input} rounded-lg focus:ring-2 focus:border-transparent resize-none transition-all duration-300`}
              placeholder="Pickup/delivery address"
              required
            />
          </div>

          {/* Product Image - Compact Design */}
          <div>
            <label className={`block text-sm font-medium ${themeStyles.label} mb-1 transition-colors duration-300`} htmlFor="image">
              Product Image *
            </label>
            <div className={`border-2 border-dashed ${themeStyles.uploadArea} rounded-lg p-4 text-center transition-all duration-300 cursor-pointer relative`}>
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mx-auto max-h-24 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: '' }));
                      setImageFile(null);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                    <Camera size={24} className={`${themeStyles.uploadIcon} mb-1 transition-colors duration-300`} />
                    <span className={`${themeStyles.uploadText} hover:underline text-sm transition-colors duration-300`}>Upload image</span>
                    <span className={`text-xs ${themeStyles.helperText} mt-1 transition-colors duration-300`}>Max 5MB</span>
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                </>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg ${themeStyles.cancelBtn} transition-colors duration-300`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${themeStyles.submitBtn} disabled:cursor-not-allowed transition-colors duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductForm;
