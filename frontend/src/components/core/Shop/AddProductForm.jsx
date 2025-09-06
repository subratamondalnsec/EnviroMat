// components/AddProductForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Camera } from 'lucide-react';
import gsap from 'gsap';

const AddProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = ['Building Materials', 'Solar Products', 'Eco Accessories', 'Garden & Home', 'Packaging']
}) => {
  const [formData, setFormData] = useState({
    image: '',
    category: categories[0] || 'Building Materials',
    name: '',
    description: '',
    price: ''
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (!formData.image) {
      alert('Please select an image for your product');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new product object
      const newProduct = {
        id: Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || '/default-product.jpg',
        rating: 0,
        reviews: 0,
        inStock: true
      };

      // Call parent's onSubmit function
      onSubmit(newProduct);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      image: '',
      category: categories[0] || 'Building Materials',
      name: '',
      description: '',
      price: ''
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
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
              Product Title *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter product name"
              maxLength={200}
              required
            />
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
              Product Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
              Product Price (₹) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Enter price"
              min="0"
              step="0.01"
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
                    <span className="text-sm text-gray-500 mt-1">JPG, PNG, WebP or GIF</span>
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
