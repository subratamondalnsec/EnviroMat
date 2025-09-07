// components/core/Shop/ProductCard.jsx
import React from 'react';
import { FaHeart } from "react-icons/fa";
import { Star, ShoppingCart, Heart, Plus, Minus, Coins, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onIncrement,
  onDecrement,
  onCancelOrder,
  onRemoveFromCart,
  isInWishlist,
  cartQuantity = 0,
  addToRefs,
  index
}) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white/50',
    border: isDarkMode ? 'border-gray-600' : 'border-gray-400',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    categoryText: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    wishlistBg: isDarkMode ? 'bg-gray-700/60' : 'bg-white/60',
    wishlistBorder: isDarkMode ? 'border-gray-500' : 'border-gray-400',
    addToCartBtn: isDarkMode 
      ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 text-white' 
      : 'bg-[#cb8fff] border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-900',
    quantityContainer: isDarkMode 
      ? 'bg-purple-900/50 border-purple-700' 
      : 'bg-purple-100 border-purple-400',
    decrementBtn: isDarkMode 
      ? 'bg-purple-800 text-purple-300 border-purple-600 hover:border-purple-500' 
      : 'bg-[#F0E7FF] text-purple-600 border-purple-400 hover:border-purple-700',
    incrementBtn: isDarkMode 
      ? 'bg-purple-600 border-purple-500 hover:bg-purple-700 text-white' 
      : 'bg-[#cb8fff] border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700',
    quantityText: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    cartIcon: isDarkMode ? 'text-gray-400' : 'text-gray-700'
  };

  // Event handlers with explicit event prevention
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    console.log("Adding to cart:", product);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrement(product.id);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartQuantity === 1) {
      handleRemoveFromCart(e);
    } else {
      onDecrement(product.id);
    }
  };

  const handleCancelOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this order request?')) {
      onCancelOrder(product);
    }
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      onRemoveFromCart(product);
    }
  };

  return (
    <div
      ref={(el) => addToRefs && addToRefs(el, index)}
      className={`${themeStyles.cardBg} backdrop-blur-sm rounded-3xl p-2 border ${themeStyles.border} relative cursor-pointer transition-colors duration-300`}
    >
      {/* Product Image */}
      <div className="relative mb-3 overflow-hidden rounded-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className={`${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300`}>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${themeStyles.wishlistBg} backdrop-blur-sm border ${themeStyles.wishlistBorder} ${
            isInWishlist ? "text-red-400" : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`
          }`}
        >
          {isInWishlist ? <FaHeart className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1 p-2">
        {/* Category */}
        <span className={`text-sm ${themeStyles.categoryText} font-medium transition-colors duration-300`}>
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className={`text-lg font-bold ${themeStyles.textPrimary} line-clamp-1 transition-colors duration-300`}>
          {product.name}
        </h3>

        {/* Description */}
        <p className={`${themeStyles.textSecondary} text-sm leading-relaxed line-clamp-2 transition-colors duration-300`}>
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating
                    ? "text-yellow-400 fill-current"
                    : `${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`
                }`}
              />
            ))}
          </div>
          <span className={`text-sm ${themeStyles.textSecondary} transition-colors duration-300`}>
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mt-1">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} transition-colors duration-300`}>
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400 border-purple-400' : 'text-purple-500 border-purple-500'} flex items-center justify-between gap-1 border rounded-full pl-0.5 pr-1 py-0.5 transition-colors duration-300`}>
              <Coins className="w-5 h-4" />
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Conditional Button Rendering - Add to Cart or Increment/Decrement */}
        {cartQuantity === 0 ? (
          /* Add to Cart Button - Show when item not in cart */
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full ${themeStyles.addToCartBtn} border py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 mt-4`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        ) : (
          /* Increment/Decrement Controls - Show when item is in cart */
          <div className={`w-full flex items-center justify-between ${themeStyles.quantityContainer} border rounded-full py-1.5 px-1.5 mt-4 transition-colors duration-300`}>
            {/* Decrement Button */}
            <button
              type="button"
              onClick={handleDecrement}
              className={`w-9 h-9 ${themeStyles.decrementBtn} rounded-full flex items-center justify-center font-extrabold border transition-colors duration-300`}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Quantity Display */}
            <div className="flex items-center">
              <ShoppingCart className={`w-5 h-5 ${themeStyles.cartIcon} transition-colors duration-300`} />
              <span className={`text-lg font-bold ${themeStyles.quantityText} min-w-8 text-center transition-colors duration-300`}>
                {cartQuantity}
              </span>
            </div>

            {/* Increment Button */}
            <button
              type="button"
              onClick={handleIncrement}
              className={`w-9 h-9 ${themeStyles.incrementBtn} border rounded-full flex items-center justify-center font-bold transition-colors duration-300`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
