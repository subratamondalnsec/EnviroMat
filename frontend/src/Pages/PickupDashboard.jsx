// components/PickupDashboard.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { toast } from 'react-hot-toast';

// Import all modular components
import DashboardHeader from '../components/core/PickUpDashboard/DashboardHeader';
import ScheduledPickups from '../components/core/PickUpDashboard/ScheduledPickup';
import EmergencyPickups from '../components/core/PickUpDashboard/EmergencyPickup';
import PickupStatistics from '../components/core/PickUpDashboard/PickupStatistics';

// Import profile API
import { loadPickerDashboard } from '../services/operations/pickerAPI';

const PickupDashboard = () => {
  const pageRef = useRef(null);
  const scheduledRef = useRef(null);
  const emergencyRef = useRef(null);
  const statsRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { 
    picker, 
    assignedPickups, 
    emergencyPickups, 
    dashboardStats, 
    loading 
  } = useSelector((state) => state.picker);

  // Fetch picker dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user.accountType === 'Picker') {
        try {
          await dispatch(loadPickerDashboard(user._id));
        } catch (error) {
          console.error('Failed to fetch picker dashboard:', error);
          toast.error('Failed to load dashboard data');
        }
      }
    };

    fetchDashboardData();
  }, [user, dispatch]);

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const elements = [
        scheduledRef.current,
        emergencyRef.current,
        statsRef.current
      ].filter(Boolean);

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
  }, [picker, assignedPickups, emergencyPickups]);

  if (loading && (!picker && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no user data available
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      ref={pageRef}
    >
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader />
      </motion.div>

      <div className="p-8 space-y-8">
        {/* Top section - Scheduled and Emergency Pickups side by side */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section - Scheduled Pickups */}
          <div 
            className="flex-1"
            ref={scheduledRef}
          >
            <ScheduledPickups pickups={assignedPickups || []} refSetter={(ref) => scheduledRef.current = ref} />
          </div>

          {/* Right section - Emergency Pickups */}
          <div 
            className="flex-1"
            ref={emergencyRef}
          >
            <EmergencyPickups emergencies={emergencyPickups || []} refSetter={(ref) => emergencyRef.current = ref} />
          </div>
        </div>

        {/* Bottom section - Statistics (full width) */}
        <div ref={statsRef}>
          <PickupStatistics dashboardStats={dashboardStats} />
        </div>
      </div>
    </div>
  );
};

export default PickupDashboard;
