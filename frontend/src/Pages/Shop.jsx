// components/Shop.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/core/Shop/ProductCard';
import AddProductForm from '../components/core/Shop/AddProductForm';
import products from '../components/core/Shop/Data.jsx';
import Checkout from './Checkout';
import Footer from '../components/common/Footer';
import { ITEM_CATEGORIES } from '../utils/constants';
import { getAllItems, addToCard, cancelRequestOfOrder, cancelFromAddToCard } from '../services/operations/orderAPI';

gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  // Get user data from Redux store
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

  // Function to fetch items from API
  const fetchItemsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiItems = await getAllItems();
      
      if (apiItems && Array.isArray(apiItems)) {
        // Transform API response to match frontend product structure
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
        
        // Combine API items with static products
        setProductList([...transformedItems, ...products]);
      }
    } catch (error) {
      console.error('Error fetching items from API:', error);
      setError('Failed to load some items from server');
      // Still show static products even if API fails
      setProductList(products);
    } finally {
      setLoading(false);
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
    
    // Fetch items from API on component mount
    fetchItemsFromAPI();
  }, []);

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

  // Filter products based on category and search
  const filteredProducts = productList.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Handle both static products (with 'name') and API products (with 'title')
    const productName = product.name || product.product?.title || product.title || '';
    const productDescription = product.description || product.product?.description || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle new product submission from the form
  const handleAddProduct = (newProduct) => {
    // Transform API response to match frontend product structure
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
    
    // Optionally refresh the entire list from API to ensure consistency
    // fetchItemsFromAPI();
  };

  // Handle showing add form
  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  // Handle closing add form
  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  // Existing functions...
  const addToCart = async (product) => {
    console.log('Attempting to add to cart:', product);
    try {
      // If user is logged in, add to cart via API
      console.log('User:', user);
      console.log('Token:', token);
      console.log('Product ID:', product.id);
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

      // Update local cart state
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id || item.id === product._id);
        if (existing) {
          return prev.map(item => 
            (item.id === product.id || item.id === product._id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        // Create a normalized product object for local cart
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
      // Still add to local cart even if API fails
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

  // Function to cancel order request
  const cancelOrderRequest = async (product) => {
    try {
      if (user && token && product.id) {
        const data = {
          buyerId: user._id,
          orderId: product.id
        };
        
        await cancelRequestOfOrder(data);
        console.log(`Order request cancelled for: ${product.name || product.title}`);
        
        // Optionally refresh the items list
        fetchItemsFromAPI();
      }
    } catch (error) {
      console.error('Error cancelling order request:', error);
      alert('Failed to cancel order request. Please try again.');
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (product) => {
    try {
      if (user && token && product.id) {
        const data = {
          buyerId: user._id,
          orderId: product.id
        };
        
        await cancelFromAddToCard(data);
        console.log(`Item removed from cart in backend: ${product.name || product.title}`);
      }

      // Update local cart state
      setCartItems(prev => prev.filter(item => item.id !== product.id && item.id !== product._id));
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Still remove from local cart even if API fails
      setCartItems(prev => prev.filter(item => item.id !== product.id && item.id !== product._id));
    }
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

  const handleCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some items before checkout.');
      return;
    }
    
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
                
                {cartItems.length > 0 && (
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart saved ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  </div>
                )}
              </div>

              {/* Add Item Button */}
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
                  onClick={handleShowAddForm}
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

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Loading items from server...
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
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
                      onCancelOrder={cancelOrderRequest}
                      onRemoveFromCart={removeFromCart}
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

      {/* Add Product Form Component */}
      <AddProductForm
        isOpen={showAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleAddProduct}
        categories={categories.filter(cat => cat !== 'All')}
      />
      
      {!showCheckout && !showAddForm && <Footer />}
    </>
  );
};

export default Shop;
