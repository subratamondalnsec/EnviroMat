// components/profile/CreditHistoryModal.jsx
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Coins,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useSelector } from 'react-redux';
import gsap from "gsap";

const CreditHistoryModal = ({
  isOpen,
  onClose,
  transactions,
  currentCredits,
}) => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const modalRef = useRef(null);
  const itemsRef = useRef([]);

  // Theme-based styles
  const themeStyles = {
    overlay: 'bg-black/20 backdrop-blur-sm',
    modal: isDarkMode ? 'bg-gray-800' : 'bg-white',
    header: isDarkMode ? 'bg-gray-700' : 'bg-neutral-400',
    closeBtn: isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white',
    statCard: isDarkMode ? 'bg-gray-600 bg-opacity-30 border-purple-400' : 'bg-white bg-opacity-15 border-purple-500',
    timelineLine: isDarkMode ? 'bg-gray-600' : 'bg-gray-200',
    transactionCard: isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-100 border-gray-300 hover:border-gray-400',
    transactionTitle: isDarkMode ? 'text-white' : 'text-gray-900',
    transactionMeta: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    separator: isDarkMode ? 'text-gray-600' : 'text-gray-400',
    noDataText: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    noDataSubtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    footer: isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50',
    footerText: isDarkMode ? 'text-gray-300' : 'text-gray-600'
  };

  useEffect(() => {
    if (!modalRef.current || !isOpen) return;

    const ctx = gsap.context(() => {
      // Animate timeline items
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen, transactions]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffInDays = Math.floor(
      (now - transactionDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...(transactions || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Calculate summary stats
  const totalEarned = sortedTransactions
    .filter((tx) => tx.type === "earned")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpent = sortedTransactions
    .filter((tx) => tx.type === "spent")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-end sm:items-center h-screen justify-center ${themeStyles.overlay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className={`${themeStyles.modal} rounded-t-3xl sm:rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative translate-y-5 transition-colors duration-300`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${themeStyles.header} text-white p-6 relative transition-colors duration-300`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-full ${themeStyles.closeBtn} transition-colors duration-300`}
                aria-label="Close modal"
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              </motion.button>

              <div className="flex items-center space-x-3 mb-4">
                <Coins className="w-8 h-8 text-yellow-300" />
                <h2 className="text-2xl font-bold">Credit History Timeline</h2>
              </div>

              <div className="flex w-full justify-center gap-6">
                {/* Current Balance */}
                <div className={`${themeStyles.statCard} w-1/3 rounded-2xl p-4 mb-4 border transition-colors duration-300`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">
                      ₹{currentCredits}
                    </div>
                    <p className="text-purple-500">Current Balance</p>
                  </div>
                </div>
                <div className={`${themeStyles.statCard} w-1/3 rounded-2xl p-4 mb-4 border transition-colors duration-300`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-green-500 mb-1">
                      <TrendingUp className="w-10 h-10" />
                      <span className="font-semibold text-3xl">₹{totalEarned}</span>
                    </div>
                    <p className="text-green-600">Total Earned</p>
                  </div>
                </div>
                <div className={`${themeStyles.statCard} w-1/3 rounded-2xl p-4 mb-4 border transition-colors duration-300`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-red-500 mb-1">
                      <TrendingDown className="w-10 h-10" />
                      <span className="font-semibold text-3xl">₹{totalSpent}</span>
                    </div>
                    <p className="text-red-400">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {sortedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className={`text-xl font-semibold ${themeStyles.noDataText} mb-2 transition-colors duration-300`}>
                    No Transaction History
                  </h3>
                  <p className={`${themeStyles.noDataSubtext} transition-colors duration-300`}>
                    Start selling waste or shopping to see your credit activity here!
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${themeStyles.timelineLine} transition-colors duration-300`}></div>

                  <div className="space-y-6">
                    {sortedTransactions.map((transaction, index) => (
                      <motion.div
                        key={index}
                        ref={(el) => (itemsRef.current[index] = el)}
                        className="relative flex items-start space-x-4"
                      >
                        {/* Timeline Dot */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 ${
                            transaction.type === "earned"
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          }`}
                        >
                          {transaction.type === "earned" ? (
                            <ArrowDownCircle className="w-6 h-6 text-white" />
                          ) : (
                            <ArrowUpCircle className="w-6 h-6 text-white" />
                          )}
                        </div>

                        {/* Transaction Details */}
                        <div className={`flex-1 ${themeStyles.transactionCard} rounded-2xl p-4 border transition-all duration-300`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${themeStyles.transactionTitle} text-lg transition-colors duration-300`}>
                              {transaction.description}
                            </h4>
                            <div
                              className={`text-xl font-bold ${
                                transaction.type === "earned"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "earned" ? "+" : "-"}₹
                              {transaction.amount}
                            </div>
                          </div>

                          <div className={`flex items-center space-x-4 text-sm ${themeStyles.transactionMeta} transition-colors duration-300`}>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                            <span className={`${themeStyles.separator} transition-colors duration-300`}>•</span>
                            <span>{getTimeAgo(transaction.date)}</span>
                          </div>

                          {/* Transaction Category Badge */}
                          <div className="mt-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                transaction.type === "earned"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.type === "earned"
                                ? "Credit Earned"
                                : "Credit Spent"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`border-t ${themeStyles.footer} p-4 transition-colors duration-300`}>
              <div className="text-center">
                <p className={`text-sm ${themeStyles.footerText} transition-colors duration-300`}>
                  Keep selling waste to earn more credits and build a sustainable future! 🌱
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreditHistoryModal;
