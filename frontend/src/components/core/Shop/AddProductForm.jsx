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

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current, {scale: 0.8, opacity: 0}, {scale:1, opacity:1, duration:0.4, ease:'power2.out'});
    }
  }, [isOpen]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload with compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        // Create an image element to compress the image
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800x600)
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
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
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

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to add products');
      return;
    }
    console.log("Form submitted:", formData);
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim() || !formData.quantity.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate title length (5-20 characters as per backend model)
    if (formData.title.length < 5 || formData.title.length > 20) {
      toast.error('Product title must be between 5 and 20 characters');
      return;
    }

    // Validate description length (25-50 characters as per backend model) 
    if (formData.description.length < 25 || formData.description.length > 50) {
      toast.error('Product description must be between 25 and 50 characters');
      return;
    }

    // Validate price (minimum 50 as per backend model)
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 50) {
      toast.error('Price must be at least ₹50');
      return;
    }

    // Validate quantity
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
      // Prepare order data for backend
      const orderData = {
        product: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: price,
          quantity: quantity,
          category: formData.category
        },
        image: {
          tempFilePath: formData.image  // Wrap base64 data in expected format
        },
        address: formData.address.trim()
      };

      // Call backend API to create order
      const createdOrder = await createOrder(orderData);
      
      // Call parent's onSubmit function with the created order
      onSubmit && onSubmit(createdOrder);

      toast.success('Product added successfully!');
      
      // Reset form and close modal
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

  // Reset form data
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

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <motion.div
        ref={modalRef}
        className="bg-[#f5f5f5] rounded-3xl p-8 max-w-xl w-full overflow-hidden relative mt-16"
      >
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
              Product Title * (5-20 characters)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter product title"
              minLength={5}
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/20 characters</p>
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
              Product Description * (25-50 characters)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition"
              placeholder="Enter product description"
              minLength={25}
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/50 characters</p>
          </div>

          {/* Product Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quantity">
              Quantity Available *
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter available quantity"
              min="1"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
              Product Price (₹) * (Minimum ₹50)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter price (minimum ₹50)"
              min="50"
              step="0.01"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition"
              placeholder="Enter your address for pickup/delivery"
              required
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
              Add Image (required)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-600 transition cursor-pointer relative">
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: '' }));
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                    <Camera size={36} className="text-gray-400 mb-2" />
                    <span className="text-green-600 hover:underline">Upload an image</span>
                    <span className="text-sm text-gray-500 mt-1">JPG, PNG, WebP or GIF (Max 5MB)</span>
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
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
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
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductForm;
