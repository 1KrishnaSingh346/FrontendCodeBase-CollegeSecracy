import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiCheckCircle, FiInfo, FiPercent, FiLoader
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const PaymentModal = ({
  item,
  onClose,
  handlePurchase,
  loading,
  type = 'tool',
  paymentStatus
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const isPaymentInProgress = loading || ['initiating', 'waiting', 'verifying'].includes(paymentStatus);
  const [localPaymentStatus, setLocalPaymentStatus] = useState(paymentStatus);

  useEffect(() => {
  setLocalPaymentStatus(paymentStatus);
}, [paymentStatus]);

useEffect(() => {
  if (localPaymentStatus === 'error') {
    const timer = setTimeout(() => {
      setLocalPaymentStatus(null);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [localPaymentStatus]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setApplyingCoupon(true);
    setCouponError('');
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const validCoupons = {
        'WELCOME20': { discount: 20, type: 'percent', message: '20% off applied!' },
        'SAVE500': { discount: 500, type: 'fixed', message: '₹500 off applied!' },
        'STUDENT10': { discount: 10, type: 'percent', message: '10% student discount!' }
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setAppliedCoupon(coupon);
        setShowCouponSuccess(true);
        setTimeout(() => setShowCouponSuccess(false), 3000);
      } else throw new Error('Invalid coupon code');
    } catch (err) {
      setCouponError(err.message);
      toast.error(err.message);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateFinalPrice = () => {
    if (!appliedCoupon) return item.price;
    if (appliedCoupon.type === 'percent') {
      return Math.max(1, item.price - Math.round(item.price * (appliedCoupon.discount / 100)));
    }
    return Math.max(1, item.price - appliedCoupon.discount);
  };

  const finalPrice = calculateFinalPrice();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 py-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 px-6 py-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-orange-200 transition p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
              Complete Your Purchase
            </h2>
            <p className="text-orange-100 text-center mt-1 text-sm">
              {type === 'tool' ? 'Premium Tool' : 'Counseling Plan'}
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
            {/* Left */}
            <div className="sm:w-1/2">
              <div className="flex gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.description || 'Premium access'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Original Price:</span>
                  <span className="font-medium">₹{item.price}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Discount ({appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}%` : `₹${appliedCoupon.discount}`}):
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      -₹{item.price - finalPrice}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between items-center font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-xl text-orange-600 dark:text-orange-400 font-bold">₹{finalPrice}</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="sm:w-1/2">
              {/* Coupon */}
              <div className="mb-4">
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiPercent className="mr-2" /> Apply Coupon Code
                </h4>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 text-sm"
                    disabled={!!appliedCoupon || applyingCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className={`px-4 py-2 text-sm transition-all ${
                        applyingCoupon
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
                      } rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none`}
                    >
                      {applyingCoupon ? <FiLoader className="animate-spin" /> : 'Apply'}
                    </button>
                  )}
                </div>

                <div className="mt-2 text-sm min-h-[24px]">
                  {couponError && <p className="text-red-500">{couponError}</p>}
                  {showCouponSuccess && appliedCoupon && (
                    <p className="text-green-600 dark:text-green-400">{appliedCoupon.message}</p>
                  )}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 flex items-start">
                <FiInfo className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Try <strong>WELCOME20</strong> or <strong>SAVE500</strong> for discounts.
                </p>
              </div>

              {/* Pay Button */}
<button
  onClick={() => handlePurchase(item._id, appliedCoupon ? couponCode : '')}
  disabled={isPaymentInProgress}
  className={`w-full py-3 px-4 rounded-lg font-bold text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
    isPaymentInProgress
      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg'
  }`}
>
  {isPaymentInProgress ? (
    <span className="flex items-center justify-center">
      <FiLoader className="animate-spin mr-2" />
      {paymentStatus === 'initiating' && 'Initiating...'}
      {paymentStatus === 'waiting' && 'Waiting for payment...'}
      {paymentStatus === 'verifying' && 'Verifying...'}
      {(!paymentStatus || paymentStatus === 'loading') && 'Processing...'}
    </span>
  ) : (
    `Pay ₹${finalPrice} Now`
  )}
</button>


              {/* ✅ Payment Status Message */}
              <div className="mt-3 text-sm text-center min-h-[24px]">
                {localPaymentStatus  === 'initiating' && (
                  <p className="text-yellow-600 dark:text-yellow-400 flex justify-center items-center">
                    <FiLoader className="animate-spin mr-2" /> Initiating payment...
                  </p>
                )}
                {localPaymentStatus  === 'waiting' && (
                  <p className="text-blue-600 dark:text-blue-400 flex justify-center items-center">
                    <FiLoader className="animate-spin mr-2" /> Checkout opened. Waiting...
                  </p>
                )}
                {localPaymentStatus  === 'verifying' && (
                  <p className="text-purple-600 dark:text-purple-400 flex justify-center items-center">
                    <FiLoader className="animate-spin mr-2" /> Verifying payment...
                  </p>
                )}
                {localPaymentStatus  === 'success' && (
                  <p className="text-green-600 dark:text-green-400 flex justify-center items-center">
                    <FiCheckCircle className="mr-2" /> Payment successful! 🎉
                  </p>
                )}
                {localPaymentStatus  === 'error' && (
                  <p className="text-red-600 dark:text-red-400 flex justify-center items-center">
                    <FiX className="mr-2" /> Payment failed. Please try again.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
