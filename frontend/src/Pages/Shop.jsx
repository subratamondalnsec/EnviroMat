// components/Shop.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/core/Shop/ProductCard';
import products from '../components/core/Shop/Data';
import Checkout from './Checkout'; // Import Checkout component
import Footer from '../components/common/Footer';


gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  
  // NEW: State for checkout popup
  const [showCheckout, setShowCheckout] = useState(false);

  // NEW: Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const shopRef = useRef(null);
  const headerRef = useRef(null);
  const productsRef = useRef([]);

  const categories = ['All', 'Building Materials', 'Solar Products', 'Eco Accessories', 'Garden & Home', 'Packaging'];

  // NEW: Load checkout state from localStorage on component mount
  useEffect(() => {
    try {
      const savedShowCheckout = localStorage.getItem('showCheckout');
      if (savedShowCheckout) {
        setShowCheckout(JSON.parse(savedShowCheckout));
      }
      
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);

  // NEW: Save cart items to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // NEW: Save checkout state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('showCheckout', JSON.stringify(showCheckout));
    } catch (error) {
      console.error('Error saving checkout state to localStorage:', error);
    }
  }, [showCheckout]);

  // NEW: Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add to cart function
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Increment quantity function
  const incrementQuantity = (productId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement quantity function
  const decrementQuantity = (productId) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Get quantity of item in cart
  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle category selection
  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(category);
  };

  // Handle clear filters
  const handleClearFilters = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm('');
    setSelectedCategory('All');
  };

  // NEW: Updated checkout handler to show popup instead of routing
  const handleCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some items before checkout.');
      return;
    }
    
    setShowCheckout(true);
  };

  // NEW: Handle checkout close
  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  // NEW: Handle order completion
  const handleOrderComplete = (orderData) => {
    console.log('Order completed:', orderData);
    
    // Clear cart and close checkout
    setCartItems([]);
    setShowCheckout(false);
    
    // Clear localStorage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('showCheckout');
    
    alert('Order placed successfully! Thank you for choosing sustainable materials.');
  };

  // Add refs to array
  const addToProductsRefs = (el, index) => {
    if (el && !productsRef.current.includes(el)) {
      productsRef.current[index] = el;
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (showCheckout) return; // Don't animate if checkout is showing

    const header = headerRef.current;
    const products = productsRef.current.filter(Boolean);

    gsap.set(header, {
      y: 50,
      opacity: 0,
    });

    gsap.set(products, {
      y: 20,
      opacity: 0,
      scale: 0.8,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: shopRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.to(header, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });

    tl.to(products, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    }, '-=0.4');

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [showCheckout]);

  return (
    <>
      {/* NEW: Conditional rendering - show checkout popup or shop */}
      <AnimatePresence mode="wait">
        {showCheckout ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-auto"
          >
            <Checkout
              cartItems={cartItems}
              onClose={handleCheckoutClose}
              onOrderComplete={handleOrderComplete}
              isModal={true}
            />
          </motion.div>
        ) : (
          <motion.section
            key="shop"
            ref={shopRef}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-16 bg-[#F9FAFB] relative overflow-hidden"
          >
            {/* Background Animation */}
            <motion.div 
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Header Section */}
              <div ref={headerRef} className="text-center mt-16 mb-16">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Sustainable, <span className="text-purple-400">Eco-Friendly</span> <span className="text-green-400">& Recycled</span> <span>Materials</span> <span className="text-purple-400">Shop</span>
                </h1>
                <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-8">
                  Discover our curated collection of eco-friendly materials and products designed for a sustainable future.
                </p>
                
                {/* NEW: Show cart persistence indicator */}
                {cartItems.length > 0 && (
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart saved ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  </div>
                )}
              </div>

              {/* Search and Filter Section */}
              <div className="mb-12">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search sustainable products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={(e) => handleCategoryClick(e, category)}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 bg-[#0ae979] border border-gray-300 hover:border-[#08DF73] hover:bg-[#eff8d8] text-gray-700 ${
                          selectedCategory === category
                            ? 'bg-[#5DE584]'
                            : 'bg-white '
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedCategory + searchTerm}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onIncrement={incrementQuantity}
                      onDecrement={decrementQuantity}
                      onToggleWishlist={toggleWishlist}
                      isInWishlist={wishlist.includes(product.id)}
                      cartQuantity={getCartQuantity(product.id)}
                      addToRefs={addToProductsRefs}
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* No Products Found */}
              {filteredProducts.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Shopping Cart Summary */}
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-6 right-6 bg-[#F7F7F7] rounded-2xl shadow-2xl p-6 border border-gray-200 z-40"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                      </p>
                      <p className="text-green-600 font-bold">
                        ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={handleCheckout}
                      className="bg-[#0ae979] border border-gray-300 hover:border-[#08DF73] hover:bg-[#eff8d8] text-gray-700 px-6 py-2 rounded-full font-semibold transition-colors duration-300"
                    >
                      Checkout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Footer - Only show when not in checkout mode */}
      {!showCheckout && <Footer />}
    </>
  );
};

export default Shop;
