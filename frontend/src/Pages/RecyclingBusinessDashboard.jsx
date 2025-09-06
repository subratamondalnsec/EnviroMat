// components/RecyclingBusinessDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { ITEM_CATEGORIES } from '../utils/constants';

// Import all modular components
import BusinessHeader from '../components/core/RecyclingDashboard/BusinessHeader';
import BusinessInfo from '../components/core/RecyclingDashboard/BusinessInfo';
import OrdersList from '../components/core/RecyclingDashboard/OrdersList';
import SalesStatistics from '../components/core/RecyclingDashboard/SalesStatistics';
import RevenueOverview from '../components/core/RecyclingDashboard/RevenueOverview';
import CategoryPerformance from '../components/core/RecyclingDashboard/CategoryPerformance';
import AddProductModal from '../components/core/RecyclingDashboard/AddProductModal'; // NEW

const RecyclingBusinessDashboard = () => {
  const pageRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);

  // Modal state for adding products
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Business data state - TODO: Replace with real API data
  const [businessData] = useState({
    businessInfo: {
      businessName: "EcoRecycle Solutions Pvt Ltd",
      ownerName: user ? `${user.firstName} ${user.lastName}` : "Business Owner",
      businessImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      establishedDate: "2020",
      location: "Kolkata, West Bengal",
      contactEmail: "contact@ecorecycle.com",
      contactPhone: "+91 9876543210",
      businessType: "Recycling & Manufacturing",
      certifications: ["ISO 14001", "Green Business", "Waste Management License"],
      totalRevenue: 245000,
      revenueGrowth: 18,
      totalOrders: 156,
      ordersGrowth: 12,
      activeProducts: 24,
      productsGrowth: 8
    },
    
    recentOrders: [
      {
        id: "ORD-2025-001",
        customerName: "Green Home Solutions",
        products: [
          { name: "Recycled Glass Planter Vase", quantity: 12, price: 299 },
          { name: "Eco-Friendly Floor Mat", quantity: 5, price: 899 }
        ],
        totalAmount: 8083,
        orderDate: "2025-01-15",
        status: "delivered",
        category: "Garden & Home"
      },
      {
        id: "ORD-2025-002", 
        customerName: "Sustainable Office Corp",
        products: [
          { name: "Eco-Friendly Stationery Set", quantity: 25, price: 399 }
        ],
        totalAmount: 9975,
        orderDate: "2025-01-14",
        status: "processing",
        category: "Paper Products"
      },
      {
        id: "ORD-2025-003",
        customerName: "Eco Living Apartments",
        products: [
          { name: "Recycled Plastic Garden Bench", quantity: 8, price: 1275 },
          { name: "Sustainable Table Lamp", quantity: 15, price: 2999 }
        ],
        totalAmount: 55185,
        orderDate: "2025-01-13",
        status: "shipped",
        category: "Home Decor"
      }
    ],

    salesStats: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      revenue: [18500, 22300, 19800, 25600, 28900, 32400],
      orders: [45, 56, 52, 68, 73, 82],
      categories: {
        'Plastic Products': 35,
        'Paper Products': 28, 
        'Glass Products': 22,
        'Metal Products': 18,
        'Textile & Fabric Products': 15,
        'Wood Products': 12,
        'E-Waste Products': 20,
        'Organic Waste Products': 8
      }
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle add product modal
  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleProductCreate = (productData) => {
    // TODO: Handle product creation with API
    console.log('New product created:', productData);
    // You can add logic here to update the product list or trigger a refresh
  };

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const elements = pageRef.current.querySelectorAll('.animate-section');
      
      gsap.set(elements, {
        y: 30,
        opacity: 0
      });

      const tl = gsap.timeline();
      tl.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, [businessData]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#F9FAFB] py-8">
      {/* Background Animation */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "reverse", 
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Business Header */}
        <div className="animate-section">
          <BusinessHeader 
            businessInfo={businessData.businessInfo} 
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Info */}
            <div className="animate-section">
              <BusinessInfo businessInfo={businessData.businessInfo} />
            </div>
            
            {/* Orders List */}
            <div className="animate-section">
              <OrdersList orders={businessData.recentOrders} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Revenue Overview */}
            <div className="animate-section">
              <RevenueOverview salesData={businessData.salesStats} />
            </div>

            {/* Category Performance */}
            <div className="animate-section">
              <CategoryPerformance categories={businessData.salesStats.categories} />
            </div>
          </div>
        </div>

        {/* Full Width Statistics */}
        <div className="animate-section mt-8">
          <SalesStatistics salesData={businessData.salesStats} />
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        show={showAddProductModal}
        onClose={handleCloseProductModal}
        onCreate={handleProductCreate}
      />
    </div>
  );
};

export default RecyclingBusinessDashboard;
