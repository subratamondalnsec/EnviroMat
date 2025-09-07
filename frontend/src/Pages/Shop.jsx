// components/Shop.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/core/Shop/ProductCard';
import AddProductForm from '../components/core/Shop/AddProductForm';
import products from '../components/core/Shop/Data.jsx';
import Checkout from './Checkout';
import Footer from '../components/common/Footer';
import ThemeToggle from '../components/common/NavbarComponents/ThemeToggle.jsx';
import { ITEM_CATEGORIES } from '../utils/constants';
import { getAllItems, addToCard, getAllAddToCardsByUser } from '../services/operations/orderAPI';

gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  // Get theme and user data from Redux store
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [productList, setProductList] = useState(products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Horizontal scrolling states
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

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

  const categories = ['All', ...ITEM_CATEGORIES];

  // Enhanced Theme-based styles
  const themeStyles = {
  background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
  text: isDarkMode ? 'text-white hover:text-gray-600' : 'text-gray-900',
  secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
  cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
  borderColor: isDarkMode ? 'border-gray-600' : 'border-gray-300',
  inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
  buttonBg: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50',
  // ... and more comprehensive styling
};


  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Fetch items from API
  const fetchItemsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiItems = await getAllItems();
      
      if (apiItems && Array.isArray(apiItems)) {
        const transformedItems = apiItems.map(item => ({
          id: item._id || item.id || Date.now() + Math.random(),
          name: item.product?.title || item.title || 'Unknown Product',
          description: item.product?.description || item.description || 'No description available',
          price: item.product?.price || item.price || 0,
          category: item.product?.category || item.category || 'Other',
          image: item.image || '/default-product.jpg',
          rating: item.rating || 0,
          reviews: item.reviews || 0,
          isNew: true,
          originalPrice: (item.product?.price || item.price || 0) * 1.2,
          discount: 0
        }));
        
        setProductList([...transformedItems, ...products]);
      }
    } catch (error) {
      console.error('Error fetching items from API:', error);
      setError('Failed to load some items from server');
      setProductList(products);
    } finally {
      setLoading(false);
    }
  };

  // Function to sync cart from backend
  const syncCartFromBackend = async () => {
    try {
      if (user && token) {
        const backendCartItems = await getAllAddToCardsByUser(user._id);
        
        if (backendCartItems && Array.isArray(backendCartItems)) {
          // Transform backend cart items to match frontend structure
          const transformedCartItems = backendCartItems.map(cartItem => {
            const order = cartItem.orderId || cartItem;
            return {
              id: order._id || order.id,
              name: order.product?.title || order.title || 'Unknown Product',
              description: order.product?.description || order.description || 'No description available',
              price: order.product?.price || order.price || 0,
              category: order.product?.category || order.category || 'Other',
              image: order.image || '/default-product.jpg',
              rating: order.rating || 0,
              reviews: order.reviews || 0,
              quantity: cartItem.quantity || 1
            };
          });
          
          // Merge with local cart items
          setCartItems(transformedCartItems);
        }
      }
    } catch (error) {
      console.error('Error syncing cart from backend:', error);
    }
  };

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
    
    fetchItemsFromAPI();
    
    // Don't sync cart automatically on mount
    // syncCartFromBackend();
  }, []);

  // Don't sync cart when user changes automatically
  // useEffect(() => {
  //   if (user && token) {
  //     syncCartFromBackend();
  //   }
  // }, [user, token]);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('showCheckout', JSON.stringify(showCheckout));
    } catch (error) {
      console.error('Error saving checkout state to localStorage:', error);
    }
  }, [showCheckout]);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  // Filter products
  const filteredProducts = productList.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const productName = product.name || product.product?.title || product.title || '';
    const productDescription = product.description || product.product?.description || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Event handlers
  const handleAddProduct = (newProduct) => {
    const transformedProduct = {
      id: newProduct.order?._id || newProduct._id || Date.now(),
      name: newProduct.order?.product?.title || newProduct.product?.title || newProduct.title,
      description: newProduct.order?.product?.description || newProduct.product?.description || newProduct.description,
      price: newProduct.order?.product?.price || newProduct.product?.price || newProduct.price,
      category: newProduct.order?.product?.category || newProduct.product?.category || newProduct.category,
      image: newProduct.order?.image || newProduct.image,
      rating: 0,
      reviews: 0,
      isNew: true,
      originalPrice: (newProduct.order?.product?.price || newProduct.product?.price || newProduct.price) * 1.2,
      discount: 0
    };
    
    setProductList(prev => [transformedProduct, ...prev]);
    setShowAddForm(false);
  };

  const addToCart = async (product) => {
    console.log('Attempting to add to cart:', product);
    try {
      if (user && token && product.id) {
        console.log('User is logged in, adding to cart via API');
        const data = {
          buyerId: user._id,
          orderId: product.id
        };
        
        console.log('Adding to cart:', data);
        await addToCard(data);
        console.log(`Item added to cart in backend: ${product.name || product.title}`);
      }

      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id || item.id === product._id);
        if (existing) {
          return prev.map(item => 
            (item.id === product.id || item.id === product._id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        const cartItem = {
          id: product.id || product._id,
          name: product.name || product.title,
          description: product.description,
          price: product.price || product.product?.price,
          category: product.category || product.product?.category,
          image: product.image,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          quantity: 1
        };
        
        return [...prev, cartItem];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id || item.id === product._id);
        if (existing) {
          return prev.map(item => 
            (item.id === product.id || item.id === product._id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, id: product.id || product._id, quantity: 1 }];
      });
    }
  };

  const incrementQuantity = (productId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

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

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(category);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some items before checkout.');
      return;
    }

     await syncCartFromBackend();
    
    // Sync cart from backend before showing checkout
    await syncCartFromBackend();
    
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  const handleOrderComplete = (orderData) => {
    console.log('Order completed:', orderData);
    
    setCartItems([]);
    setShowCheckout(false);
    
    localStorage.removeItem('cartItems');
    localStorage.removeItem('showCheckout');
    
    alert('Order placed successfully! Thank you for choosing sustainable materials.');
  };

  const addToProductsRefs = (el, index) => {
    if (el && !productsRef.current.includes(el)) {
      productsRef.current[index] = el;
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (showCheckout || showAddForm) return;

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
  }, [showCheckout, showAddForm]);

  return (
    <>
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
            className={`py-16 ${themeStyles.background} relative overflow-hidden transition-colors duration-300`}
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
              {/* Header Section with Theme Toggle */}
              <div ref={headerRef} className="text-center mt-16 mb-16">
                <h1 className={`text-5xl lg:text-6xl font-bold ${themeStyles.text} leading-tight mb-6 transition-colors duration-300`}>
                  Sustainable, <span className="text-purple-400">Eco-Friendly</span> <span className="text-green-400">& Recycled</span> <span>Materials</span> <span className="text-purple-400">Shop</span>
                </h1>
                <p className={`${themeStyles.secondaryText} text-lg max-w-4xl mx-auto mb-8 transition-colors duration-300`}>
                  Discover our curated collection of eco-friendly materials and products designed for a sustainable future.
                </p>
                
                {/* Enhanced Cart Notification */}
                {cartItems.length > 0 && (
                  <div className={`inline-flex items-center space-x-2 ${themeStyles.cartNotificationBg} px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300`}>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart saved ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mb-8 gap-3">
                <button
                  onClick={fetchItemsFromAPI}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700 font-semibold flex items-center gap-2 rounded-full px-3 py-2 shadow-md transition-all duration-300 hover:scale-102"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Search and Filter Section */}
              <div className="mb-12">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} w-5 h-5`} />
                    <input
                      type="text"
                      placeholder="Search sustainable products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 ${themeStyles.inputBg} border ${themeStyles.borderColor} rounded-full focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300 ${themeStyles.text}`}
                    />
                  </div>

                  {/* Horizontal Scrolling Category Filter */}
                  <div className="flex-1 lg:flex-initial max-w-full lg:max-w-2xl">
                    <div className="relative">
                      {/* Left Arrow */}
                      {showLeftArrow && (
                        <button
                          onClick={scrollLeft}
                          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 ${themeStyles.cardBg} border ${themeStyles.borderColor} rounded-full p-2 shadow-lg ${themeStyles.buttonBg} transition-all duration-200`}
                          style={{ marginLeft: '-12px' }}
                        >
                          <ChevronLeft className={`w-4 h-4 ${themeStyles.secondaryText}`} />
                        </button>
                      )}

                      {/* Scrollable Container */}
                      <div
                        ref={scrollContainerRef}
                        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-6"
                        onScroll={checkScrollPosition}
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        }}
                      >
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={(e) => handleCategoryClick(e, category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                              selectedCategory === category
                                ? 'bg-[#5DE584] border border-[#08DF73] text-gray-700'
                                : `${themeStyles.cardBg} border ${themeStyles.borderColor} hover:border-[#08DF73] hover:bg-[#eff8d8] ${themeStyles.text}`
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      {/* Right Arrow */}
                      {showRightArrow && (
                        <button
                          onClick={scrollRight}
                          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 ${themeStyles.cardBg} border ${themeStyles.borderColor} rounded-full p-2 shadow-lg ${themeStyles.buttonBg} transition-all duration-200`}
                          style={{ marginRight: '-12px' }}
                        >
                          <ChevronRight className={`w-4 h-4 ${themeStyles.secondaryText}`} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className={`inline-flex items-center px-4 py-2 ${themeStyles.loadingBg} rounded-full transition-colors duration-300`}>
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isDarkMode ? 'border-green-300' : 'border-green-600'} mr-2`}></div>
                    Loading items from server...
                  </div>
                </div>
              )}

              {/* Enhanced Error State */}
              {error && (
                <div className="text-center py-4">
                  <div className={`inline-flex items-center px-4 py-2 ${themeStyles.errorBg} rounded-full text-sm transition-colors duration-300`}>
                    ⚠️ {error}
                  </div>
                </div>
              )}

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
                  <h3 className={`text-2xl font-bold ${themeStyles.text} mb-2 transition-colors duration-300`}>No Products Found</h3>
                  <p className={`${themeStyles.secondaryText} mb-6 transition-colors duration-300`}>Try adjusting your search or filter criteria</p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Enhanced Shopping Cart Summary */}
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`fixed bottom-6 right-6 ${themeStyles.cardBg} rounded-2xl shadow-2xl p-6 border ${themeStyles.borderColor} z-40 transition-colors duration-300`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${themeStyles.cartIconBg} rounded-full p-3 transition-colors duration-300`}>
                      <ShoppingCart className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'} transition-colors duration-300`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${themeStyles.text} transition-colors duration-300`}>
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                      </p>
                      <p className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}>
                        ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={handleCheckout}
                      className={`${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' : 'bg-[#0ae979] border border-gray-300 hover:border-[#08DF73] hover:bg-[#eff8d8] text-gray-700'} px-6 py-2 rounded-full font-semibold transition-colors duration-300`}
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

      {/* Add Product Form Component */}
      <AddProductForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddProduct}
        categories={categories.filter(cat => cat !== 'All')}
      />
      
      {!showCheckout && !showAddForm && <Footer />}

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};


export default Shop;
