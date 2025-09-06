// components/pickup/PickupStatistics.jsx
import React, { useRef, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Calendar } from 'lucide-react';
import gsap from 'gsap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PickupStatistics = ({ dashboardStats, refSetter }) => {
  const chartRef = useRef(null);

  // Add null checks for dashboardStats
  if (!dashboardStats || !dashboardStats.monthlyData) {
    return (
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const { monthlyData, totalPickups, completedPickups, pendingPickups, totalEarnings } = dashboardStats;

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(chartRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }, chartRef);

    return () => ctx.revert();
  }, []);

  const lineData = {
    labels: monthlyData.days || [],
    datasets: [
      {
        label: 'Daily Pickups',
        data: monthlyData.pickups || [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const barData = {
    labels: ['Plastic', 'Paper', 'Metal', 'Organic'],
    datasets: [
      {
        label: 'Waste Type Distribution',
        data: monthlyData.wasteTypes || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold',
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            weight: 'bold',
            size: 10
          }
        }
      }
    }
  };

  const monthlyPickupsTotal = monthlyData.pickups.reduce((sum, count) => sum + count, 0);

  return (
    <div 
      ref={(el) => { chartRef.current = el; refSetter && refSetter(el); }}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-500" />
          Monthly Statistics
        </h3>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold text-sm">{totalPickups} Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Daily Pickup Trend</h4>
          <div className="h-48">
            <Line data={lineData} options={options} />
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Waste Type Distribution</h4>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 bg-green-100 rounded-xl">
          <div className="text-lg md:text-xl font-bold text-green-600">{totalPickups}</div>
          <div className="text-xs text-gray-600">Total Pickups</div>
        </div>
        <div className="text-center p-3 bg-purple-100 rounded-xl">
          <div className="text-lg md:text-xl font-bold text-purple-600">{completedPickups}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-blue-100 rounded-xl">
          <div className="text-lg md:text-xl font-bold text-blue-600">{pendingPickups}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="text-center p-3 bg-orange-100 rounded-xl">
          <div className="text-lg md:text-xl font-bold text-orange-600">{totalEarnings}</div>
          <div className="text-xs text-gray-600">Credit Points</div>
        </div>
      </div>
    </div>
  );
};

export default PickupStatistics;
