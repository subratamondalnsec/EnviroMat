// components/Checkout.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Truck, Leaf, Package, ShoppingCart } from "lucide-react";
import gsap from "gsap";

import CheckoutHeader from "../components/core/Checkout/CheckoutHeader";
import CartItemsSection from "../components/core/Checkout/CartItems";
import ShippingForm from "../components/core/Checkout/ShippingForm";
import PaymentForm from "../components/core/Checkout/PaymentForm";
import OrderSummary from "../components/core/Checkout/OrderSummary";

const Checkout = ({
  cartItems = [],
  onClose,
  onOrderComplete,
  isModal = false,
}) => {
  // User coins balance (static for now)
  const userCoins = 480;

  // State management - Starting from step 1 (Shipping)
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [carbonOffset, setCarbonOffset] = useState(false);
  const [ecoPackaging, setEcoPackaging] = useState(true);
  const [payWithCoins, setPayWithCoins] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for animations
  const checkoutRef = useRef(null);
  const headerRef = useRef(null);
  const cartSectionRef = useRef(null);
  const formRef = useRef(null);
  const summaryRef = useRef(null);

  // Calculate totals with safety checks
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item?.price || 0) * (item?.quantity || 0);
  }, 0);

  const carbonOffsetFee = carbonOffset ? subtotal * 0.02 : 0;
  const ecoPackagingFee = ecoPackaging ? 5 : 0;
  const shippingFees = {
    eco: 0,
    standard: 30,
    express: 70,
  };
  const shippingFee = shippingFees[shippingMethod] || 30;
  const total = subtotal + carbonOffsetFee + ecoPackagingFee + shippingFee;

  // Coin payment calculations
  const useCoinsWithCover = payWithCoins && userCoins >= total;
  const finalAmountToPay = payWithCoins ? Math.max(total - userCoins, 0) : total;

  // Shipping options
  const shippingOptions = [
    {
      id: "eco",
      name: "Eco-Friendly Delivery",
      description: "Carbon-neutral delivery via electric vehicles",
      price: 0,
      duration: "5-7 business days",
      icon: <Leaf className="w-5 h-5 text-green-600" />,
    },
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Regular delivery service",
      price: 30,
      duration: "3-5 business days",
      icon: <Truck className="w-5 h-5 text-purple-600" />,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Fast delivery service",
      price: 70,
      duration: "1-2 business days",
      icon: <Package className="w-5 h-5 text-orange-600" />,
    },
  ];

  // Steps configuration (only 2 steps now)
  const steps = [
    { number: 1, title: "Shipping", icon: <Truck className="w-4 h-4" /> },
    { number: 2, title: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  // Form handlers
  const handleShippingAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        shippingAddress,
        paymentInfo: useCoinsWithCover ? null : paymentInfo,
        cartItems,
        shippingMethod,
        carbonOffset,
        ecoPackaging,
        payWithCoins,
        coinsUsed: payWithCoins ? Math.min(userCoins, total) : 0,
        finalAmountPaid: finalAmountToPay,
        total,
        orderDate: new Date().toISOString(),
      };

      onOrderComplete && onOrderComplete(orderData);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced GSAP Animations
  useEffect(() => {
    if (!checkoutRef.current) return;

    const ctx = gsap.context(() => {
      const elements = [
        headerRef.current,
        cartSectionRef.current,
        formRef.current,
        summaryRef.current,
      ].filter(Boolean);

      // Set initial states
      gsap.set(elements, {
        y: 30,
        opacity: 0,
        scale: 0.98,
      });

      // Create entrance timeline
      const tl = gsap.timeline();

      tl.to(headerRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
        .to(
          cartSectionRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        .to(
          [formRef.current, summaryRef.current],
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
    }, checkoutRef);

    return () => ctx.revert();
  }, [currentStep]);

  // Early return if no cart items
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to proceed with checkout
          </p>
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isModal ? "fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto" : ""
      }`}
    >
      <section
        ref={checkoutRef}
        className={`${isModal ? "min-h-screen" : ""} bg-[#F9FAFB] py-8 ${
          isModal ? "relative" : ""
        }`}
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 opacity-3"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle, #10B981 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Component */}
          <CheckoutHeader
            ref={headerRef}
            onClose={onClose}
            isModal={isModal}
            currentStep={currentStep}
            steps={steps}
          />

          {/* Cart Items Section Component */}
          <CartItemsSection
            cartItems={cartItems}
            subtotal={subtotal}
            refSetter={(el) => (cartSectionRef.current = el)}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div
                ref={formRef}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <ShippingForm
                      shippingAddress={shippingAddress}
                      handleShippingAddressChange={handleShippingAddressChange}
                      shippingMethod={shippingMethod}
                      setShippingMethod={setShippingMethod}
                      shippingOptions={shippingOptions}
                      carbonOffset={carbonOffset}
                      setCarbonOffset={setCarbonOffset}
                      ecoPackaging={ecoPackaging}
                      setEcoPackaging={setEcoPackaging}
                      carbonOffsetFee={carbonOffsetFee}
                      ecoPackagingFee={ecoPackagingFee}
                      onNext={handleNext}
                      onClose={onClose}
                    />
                  )}

                  {currentStep === 2 && (
                    <PaymentForm
                      paymentInfo={paymentInfo}
                      handlePaymentInfoChange={handlePaymentInfoChange}
                      payWithCoins={payWithCoins}
                      setPayWithCoins={setPayWithCoins}
                      userCoins={userCoins}
                      total={total}
                      useCoinsWithCover={useCoinsWithCover}
                      finalAmountToPay={finalAmountToPay}
                      isProcessing={isProcessing}
                      onSubmit={handlePlaceOrder}
                      onPrev={handlePrev}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary Component */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shippingFee={shippingFee}
                carbonOffset={carbonOffset}
                carbonOffsetFee={carbonOffsetFee}
                ecoPackaging={ecoPackaging}
                ecoPackagingFee={ecoPackagingFee}
                payWithCoins={payWithCoins}
                userCoins={userCoins}
                total={total}
                finalAmountToPay={finalAmountToPay}
                refSetter={(el) => (summaryRef.current = el)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;