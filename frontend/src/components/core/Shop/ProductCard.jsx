// components/ProductCard.jsx
import React from 'react';
import { FaHeart } from "react-icons/fa";
import { Star, ShoppingCart, Heart, Plus, Minus, Coins } from 'lucide-react';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onIncrement,
  onDecrement,
  isInWishlist,
  cartQuantity = 0, // New prop for cart quantity
  addToRefs,
  index
}) => {
  // Handle wishlist with explicit event prevention
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  // Handle add to cart with explicit event prevention
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  // Handle increment with explicit event prevention
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrement(product.id);
  };

  // Handle decrement with explicit event prevention
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDecrement(product.id);
  };

  return (
    <div
      ref={(el) => addToRefs(el, index)}
      className="bg-white/50 backdrop-blur-sm rounded-3xl p-2 border border-gray-400 relative cursor-pointer"
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
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 bg-white/60 backdrop-blur-sm border border-gray-400 ${
            isInWishlist ? "text-red-400" : "text-gray-600"
          }`}
        >
          {isInWishlist ? <FaHeart className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1 p-2">
        {/* Category */}
        <span className="text-sm text-purple-600 font-medium">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
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
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xl font-bold text-purple-500">
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm font-bold text-purple-500 flex items-center justify-between gap-1 border border-purple-500 rounded-full pl-0.5 pr-1 py-0.5">
              <Coins className="w-5 h-4" />{product.originalPrice}
            </span>
          )}
        </div>

        {/* Conditional Button Rendering - Add to Cart or Increment/Decrement */}
        {cartQuantity === 0 ? (
          /* Add to Cart Button - Show when item not in cart */
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-900 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 mt-4"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        ) : (
          /* Increment/Decrement Controls - Show when item is in cart */
          <div className="w-full flex items-center justify-between bg-purple-100 border-1 border-purple-400 rounded-full py-[5px] px-1.5 mt-4">
            {/* Decrement Button */}
            <button
              type="button"
              onClick={handleDecrement}
              className="w-9 h-9 bg-[#F0E7FF] text-purple-600 rounded-full flex items-center justify-center font-extrabold border-1 border-purple-400 hover:border-purple-700 transition-colors duration-100 "
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Quantity Display */}
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="text-lg font-bold text-gray-700 min-w-[2rem] text-center">
                {cartQuantity}
              </span>
            </div>

            {/* Increment Button */}
            <button
              type="button"
              onClick={handleIncrement}
              className="w-9 h-9 bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700 rounded-full flex items-center justify-center font-bold transition-colors duration-100"
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
