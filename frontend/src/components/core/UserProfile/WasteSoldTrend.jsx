// components/profile/WasteSoldTrend.jsx
import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Recycle } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WasteSoldTrend = ({ wasteTrendData }) => {
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
    labels: wasteTrendData.months,
    datasets: [
      {
        label: 'Plastic (kg)',
        data: wasteTrendData.plastic,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Paper (kg)',
        data: wasteTrendData.paper,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Metal (kg)',
        data: wasteTrendData.metal,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
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
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
    },
  };

  const totalWaste = wasteTrendData.plastic.reduce((a, b) => a + b, 0) +
                   wasteTrendData.paper.reduce((a, b) => a + b, 0) +
                   wasteTrendData.metal.reduce((a, b) => a + b, 0);

  return (
    <div ref={sectionRef} className={`${themeStyles.cardBg} rounded-3xl p-6 border transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${themeStyles.heading} flex items-center transition-colors duration-300`}>
          <Recycle className="w-6 h-6 mr-2 text-green-500" />
          Waste Sold Trend
        </h3>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">{totalWaste}kg Total</span>
        </div>
      </div>
      
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-green-100 rounded-xl">
          <div className="text-2xl font-bold text-green-600">
            {wasteTrendData.plastic.reduce((a, b) => a + b, 0)}kg
          </div>
          <div className="text-sm text-gray-600">Plastic Recycled</div>
        </div>
        <div className="text-center p-4 bg-purple-100 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">
            {wasteTrendData.paper.reduce((a, b) => a + b, 0)}kg
          </div>
          <div className="text-sm text-gray-600">Paper Recycled</div>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">
            {wasteTrendData.metal.reduce((a, b) => a + b, 0)}kg
          </div>
          <div className="text-sm text-gray-600">Metal Recycled</div>
        </div>
      </div>
    </div>
  );
};

export default WasteSoldTrend;
