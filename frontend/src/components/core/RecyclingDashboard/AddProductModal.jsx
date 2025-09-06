// components/core/RecyclingDashboard/AddProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Package } from 'lucide-react';
import { useDispatch } from 'react-redux';
import gsap from 'gsap';
import toast, { Toaster } from "react-hot-toast";

const AddProductModal = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Building Materials');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const modalRef = useRef(null);

  // Product categories for recycled products
  const categories = [
    'Building Materials',
    'Solar Products',
    'Eco Accessories',
    'Garden & Home',
    'Packaging',
    'Kitchen & Dining',
    'Home Decor',
    'Fitness & Wellness'
  ];

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

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
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
    setDescription('');
    setCategory('Building Materials');
    setPrice('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title.trim() || !description.trim()){
      toast.error('Please fill in title and description');
      return;
    }
    
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image for your product');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productData = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        price: parseFloat(price),
        image: imageFile,
        status: 'active'
      };

      // TODO: Replace with actual API call
      // const result = await dispatch(createProduct(productData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        data: {
          id: Date.now(),
          ...productData,
          createdAt: new Date().toISOString()
        }
      };

      onCreate && onCreate(mockResult.data);
      toast.success('Product added successfully!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if(!show) return null;

  return (
    <motion.div
      className="addProduct fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
    >
      <motion.div
        ref={modalRef}
        className="bg-[#f5f5f5] rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative mx-4"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          <Package className="w-8 h-8 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">Product Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter product name"
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">Product Description *</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition"
              placeholder="Describe your recycled product, its features, and benefits..."
              maxLength={500}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">Product Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-600 transition cursor-pointer relative">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg object-cover"
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
                    <Camera size={36} className="text-gray-400 mb-2" />
                    <span className="text-green-600 hover:underline">Upload product image</span>
                    <span className="text-sm text-gray-500 mt-1">JPG, PNG, WebP or GIF (Max 5MB)</span>
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

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
      <Toaster position="top-right" />
    </motion.div>
  );
};

export default AddProductModal;
