import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "motion/react";
import {
  User,
  Phone,
  Mail,
  Hash,
  Truck,
  Star,
  MapPin,
  Landmark,
  Edit3,
  Layers3,
  Map,
} from "lucide-react";
import { loadPickerDashboard } from "../../../services/operations/pickerAPI";
import { Bar, Line } from "react-chartjs-2";
import EditPickerProfile from "./EditPickerProfile";

// ---------- STYLE CONSTANTS ----------
const statCardStyles =
  "bg-gradient-to-br from-green-50 via-green-100 to-teal-50 border border-green-200 rounded-2xl shadow flex flex-col items-center justify-center py-6 px-3";

const boxLabel =
  "flex items-center gap-3 mb-1 font-semibold text-gray-700 text-xs uppercase tracking-wider";
const valStyle = "font-medium text-gray-900 ml-3";
const infoBox =
  "flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition mb-2 shadow-sm border border-gray-100";

const chartCardStyles =
  "bg-gray-100 border border-gray-400 rounded-3xl p-6 mb-8 shadow-sm";

// ✅ Fixed missing variable to fix the runtime error
const chartLabelClass = "text-lg font-semibold text-green-800 mb-4";

const PickerProfile = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { 
    picker, 
    assignedPickups, 
    emergencyPickups,
    dashboardStats,
    loading: pickerLoading, 
    error 
  } = useSelector((state) => state.picker);
  
  const [isEditing, setIsEditing] = useState(false);
  const loading = profileLoading || pickerLoading;

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Profile will be updated via Redux when API call succeeds
  };

  // Load picker dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (user && user._id && user.accountType === "Picker") {
        try {
          await dispatch(loadPickerDashboard(user._id));
        } catch (error) {
          console.error("Failed to load picker dashboard:", error);
        }
      }
    };

    loadDashboardData();
  }, [user, dispatch]);

  // Use picker data from Redux state, with fallback to user data
  const profile = picker || user;

  // ----- Chart Data -----
  // Use real dashboard stats from backend instead of hardcoded data
  const chartLabels = dashboardStats?.monthlyData?.days || [];
  const pickupsData = dashboardStats?.monthlyData?.pickups || [];
  
  // For waste data, we'll calculate from pickup quantities or use a default
  // Since backend provides waste types count, we'll create synthetic weight data
  const wasteData = pickupsData.map(pickupCount => pickupCount * 2.5); // Estimate 2.5kg per pickup

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Pickups",
        data: pickupsData,
        backgroundColor: [
          "#22c55eaa",
          "#10b981aa",
          "#a7f3d0",
          "#2dd4bffa",
          "#06b6d4cc",
          "#818cf8bb",
          "#f97316bb",
          "#fde68a",
        ],
        borderRadius: 8,
        maxBarThickness: 40,
      },
      {
        label: "Waste Collected (kg)",
        data: wasteData,
        backgroundColor: "rgba(139, 92, 246, 0.22)",
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const lineData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Waste Collected (kg)",
        data: wasteData,
        borderColor: "#10b981",
        backgroundColor: "#34d39966",
        pointBackgroundColor: "#10b981",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // ----- LOADING -----
  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF6]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 rounded-full border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if needed
  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF6]">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">Failed to load profile</p>
          <button 
            onClick={() => dispatch(loadPickerDashboard(user?._id))}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if no profile data available
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF6]">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  // ----- EDITING -----
  if (isEditing) {
    return (
      <EditPickerProfile
        profile={profile}
        onCancel={handleCancel}
        onSave={handleSaveProfile}
      />
    );
  }

  // ----- MAIN RENDER -----
  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 mb-10">
        {/* ---------- HEADER ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between mb-10 shadow-2xl"
        >
          {/* Left: Profile pic & name */}
          <div className="flex gap-8 items-center w-full md:w-auto">
            <div className="relative">
              <img
                src={
                  profile?.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${profile?.firstName}%20${profile?.lastName}`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <span
                title={profile?.isActive ? "Active" : "Inactive"}
                className={`absolute bottom-1 right-0 w-5 h-5 border-2 border-white rounded-full ${
                  profile?.isActive ? "bg-green-400" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <span className="bg-white/30 text-green-800 font-bold text-xs px-4 py-1 rounded-full shadow-sm">
                  Waste Picker
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold shadow ${
                    profile?.isActive
                      ? "bg-green-300 bg-opacity-30 text-green-800"
                      : "bg-gray-400 bg-opacity-30 text-gray-700"
                  }`}
                >
                  {profile?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-white text-xs mt-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {profile?.address?.city}, {profile?.address?.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{profile?.vehicleDetails?.vehicleType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Edit button + Rating in vertical stack */}
          <div className="flex flex-col items-end gap-3 mt-6 md:mt-0">
            <button
              className="bg-white/90 hover:bg-white text-green-600 px-5 py-2 rounded-xl shadow font-semibold flex items-center gap-2"
              onClick={handleEditClick}
              title="Edit Profile"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit</span>
            </button>
            <div className="flex items-center gap-2 rounded-full px-3 py-2 text-yellow-800 font-bold bg-yellow-50 shadow-sm border border-yellow-100">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="flex items-center gap-2">
                {profile?.rating?.average?.toFixed(1)}
                <span className="text-xs text-yellow-700">
                  ({profile?.rating?.count})
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* ---------- STAT CARDS ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className={statCardStyles}>
            <div className="text-2xl text-blue-500 font-bold">
              {dashboardStats?.completedPickups || 0}
            </div>
            <div className="text-md text-gray-500 mt-1 font-semibold">
              Completed Pickups
            </div>
          </div>
          <div className={statCardStyles}>
            <div className="text-2xl text-purple-600 font-bold">
              {profile?.assignedDeliveries?.length || 0}
            </div>
            <div className="text-md text-gray-500 mt-1 font-semibold">
              Deliveries
            </div>
          </div>
          <div className={statCardStyles}>
            <div className="text-2xl text-yellow-600 font-bold">
              {profile?.rating?.average?.toFixed(1) || "0.0"}
            </div>
            <div className="text-md text-gray-500 mt-1 font-semibold">
              Avg. Rating ({profile?.rating?.count || 0})
            </div>
          </div>
        </div>

        {/* ---------- PICKER DETAILS & ADDRESS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Picker Details */}
          <div className="bg-white border border-green-100 rounded-2xl shadow p-7">
            <div className="text-green-800 font-bold mb-4 flex items-center gap-2">
              <Layers3 className="w-5 h-5" />
              Picker Details
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.firstName} {profile?.lastName}
              </span>
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-medium text-gray-800">{profile?.email}</span>
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.contactNumber}
              </span>
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.vehicleDetails?.vehicleType}
              </span>
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Hash className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.vehicleDetails?.vehicleNumber || "Not registered"}
              </span>
            </div>
          </div>

          {/* Address & Service Areas */}
          <div className="bg-white border border-green-100 rounded-2xl shadow p-7">
            <div className="text-green-800 font-bold mb-4 flex items-center gap-2">
              <Map className="w-5 h-5" />
              Address & Service Areas
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.address?.street}
              </span>
            </div>
            <div className="flex gap-2">
              <div className={`${infoBox} flex-1`}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-sky-600" />
                </div>
                <span className="font-medium text-gray-800">
                  {profile?.address?.city}
                </span>
              </div>
              <div className={`${infoBox} flex-1`}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-800">
                  {profile?.address?.state}
                </span>
              </div>
            </div>
            <div className={infoBox}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <Hash className="w-5 h-5 text-purple-500" />
              </div>
              <span className="font-medium text-gray-800">
                {profile?.address?.pinCode}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase text-gray-600 mb-1 font-bold">
                Service Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.serviceAreas?.length > 0 ? (
                  profile.serviceAreas.map((area, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                    >
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">
                    No service areas specified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- ANALYTICS ---------- */}
        <div className={chartCardStyles}>
          <div className={chartLabelClass}>Monthly Pickups & Waste Collection</div>
          {chartLabels.length > 0 ? (
            <div className="w-full md:flex gap-8 items-start">
              <div className="md:w-3/5 w-full min-w-[250px]">
                <Bar
                  data={barData}
                  options={{
                    plugins: {
                      legend: { position: "top", labels: { color: "#222" } },
                    },
                    responsive: true,
                    scales: {
                      x: { grid: { display: false }, ticks: { color: "#444" } },
                      y: { grid: { color: "#eee" }, ticks: { color: "#444" } },
                    },
                  }}
                  height={225}
                />
              </div>
              <div className="md:w-2/5 w-full mt-8 md:mt-0">
                <div className="mb-2 font-semibold text-green-900 text-xs">
                  Waste (kg) Trend
                </div>
                <Line
                  data={lineData}
                  options={{
                    plugins: { legend: { display: false } },
                    responsive: true,
                    scales: {
                      x: { grid: { display: false }, ticks: { color: "#555" } },
                      y: { grid: { color: "#f2f1fa" }, ticks: { color: "#999" } },
                    },
                  }}
                  height={110}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No pickup data available yet</p>
              <p className="text-gray-400 text-sm">Charts will appear once you complete your first pickups</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickerProfile;
