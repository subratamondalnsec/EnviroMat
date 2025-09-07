// components/profile/SpendingHistory.jsx
import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CreditCard, TrendingDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpendingHistory = ({ spendingData }) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const sectionRef = useRef(null);

  // Theme-based styles
  const themeStyles = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-400',
    heading: isDarkMode ? 'text-white' : 'text-gray-900'
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const chartData = {
    labels: spendingData.months,
    datasets: [
      {
        label: 'Credits Spent',
        data: spendingData.spending,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Credits Earned',
        data: spendingData.earning,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          },
          color: isDarkMode ? '#ffffff' : '#000000'
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
          display: false,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            weight: 'bold'
          },
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            weight: 'bold'
          },
          color: isDarkMode ? '#ffffff' : '#000000',
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
    },
  };

  const totalSpent = spendingData.spending.reduce((a, b) => a + b, 0);
  const totalEarned = spendingData.earning.reduce((a, b) => a + b, 0);
  const netBalance = totalEarned - totalSpent;

  return (
    <div ref={sectionRef} className={`${themeStyles.cardBg} rounded-3xl p-6 border transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${themeStyles.heading} flex items-center transition-colors duration-300`}>
          <CreditCard className="w-6 h-6 mr-2 text-purple-500" />
          Credit History
        </h3>
        <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
          <TrendingDown className="w-4 h-4" />
          <span className="font-semibold">₹{totalSpent} Spent</span>
        </div>
      </div>
      
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-red-100 rounded-xl">
          <div className="text-2xl font-bold text-red-600">₹{totalSpent}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-xl">
          <div className="text-2xl font-bold text-green-600">₹{totalEarned}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        <div className={`text-center p-4 rounded-xl ${
          netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
        }`}>
          <div className={`text-2xl font-bold ${
            netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            ₹{Math.abs(netBalance)}
          </div>
          <div className="text-sm text-gray-600">
            {netBalance >= 0 ? 'Net Savings' : 'Net Deficit'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingHistory;
