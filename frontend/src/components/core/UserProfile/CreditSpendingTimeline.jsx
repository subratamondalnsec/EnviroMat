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
import gsap from "gsap";

const CreditHistoryModal = ({
  isOpen,
  onClose,
  transactions,
  currentCredits,
}) => {
  const modalRef = useRef(null);
  const itemsRef = useRef([]);

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
          className="fixed inset-0 z-50 flex items-end sm:items-center h-screen justify-center bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative translate-y-5"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-neutral-400 text-white p-6 relative">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white "
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-gray-800" />
              </motion.button>

              <div className="flex items-center space-x-3 mb-4">
                <Coins className="w-8 h-8 text-yellow-300" />
                <h2 className="text-2xl font-bold">Credit History Timeline</h2>
              </div>

              <div className="flex w-full justify-center gap-6">
                {/* Current Balance */}
                <div className="bg-white bg-opacity-15 w-1/3 rounded-2xl p-4 mb-4 border border-purple-500">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">
                      ₹{currentCredits}
                    </div>
                    <p className="text-purple-500">Current Balance</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-15 w-1/3 rounded-2xl p-4 mb-4 border border-purple-500">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-green-500 mb-1">
                      <TrendingUp className="w-10 h-10" />
                    <span className="font-semibold text-3xl">₹{totalEarned}</span>
                    </div>
                    <p className="text-green-600">Total Earned</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-15 w-1/3 rounded-2xl p-4 mb-4 border border-purple-500">
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
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Transaction History
                  </h3>
                  <p className="text-gray-500">
                    Start selling waste or shopping to see your credit activity
                    here!
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

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
                        <div className="flex-1 bg-gray-100 rounded-2xl p-4 border border-gray-300 hover:border-gray-400 transition-colors duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">
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

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                            <span className="text-gray-400">•</span>
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
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Keep selling waste to earn more credits and build a
                  sustainable future! 🌱
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
