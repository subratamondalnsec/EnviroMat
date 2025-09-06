// components/core/RecyclingDashboard/RevenueOverview.jsx
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
import { DollarSign, TrendingUp } from 'lucide-react';
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

const RevenueOverview = ({ salesData }) => {
  const sectionRef = useRef(null);

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
    labels: salesData.months,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.revenue,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
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
            weight: 'bold'
          },
          callback: function(value) {
            return '₹' + (value / 1000) + 'k';
          }
        }
      },
    },
  };

  const totalRevenue = salesData.revenue.reduce((a, b) => a + b, 0);
  const avgRevenue = Math.round(totalRevenue / salesData.revenue.length);

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-6 border border-gray-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-green-500" />
          Revenue Overview
        </h3>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="h-64 mb-4">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="text-xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-xl font-bold text-blue-600">
            ₹{avgRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg. Monthly</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
