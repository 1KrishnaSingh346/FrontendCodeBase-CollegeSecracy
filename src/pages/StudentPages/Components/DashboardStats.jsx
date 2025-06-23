import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';

const DashboardStats = ({ user, loading = false }) => {
  const counselingPlans = user?.counselingPlans || [];
  const premiumTools = user?.premiumTools || [];

  const motivationalQuotes = [
    "Success is no accident. It’s hard work, perseverance and learning.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Push yourself, because no one else is going to do it for you.",
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-700">
        <p className="text-sm md:text-base text-purple-900 dark:text-purple-200 font-medium italic">
          “{randomQuote}”
        </p>
      </div>

      {/* Counseling Plans */}
      <div>
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          🎓 Your Counseling Plans
        </h2>

        {loading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                <Skeleton height={16} width={180} />
                <Skeleton height={12} width={150} className="mt-2" />
                <Skeleton height={12} width={150} className="mt-1" />
              </div>
            ))}
          </div>
        ) : counselingPlans.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {counselingPlans.map((plan, index) => {
              const expiry = new Date(plan.planId?.expiryDate);
              const isActive = expiry > new Date();

              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg p-4 border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-blue-800 dark:text-blue-200 font-semibold text-base capitalize">
                        {plan.planId?.title || 'Counseling Plan'}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Purchased on: {formatDate(plan.purchasedOn)}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Valid till: {formatDate(plan.planId?.expiryDate)}
                      </p>
                    </div>
                    <div>
                      {isActive ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <HiOutlineCheckCircle /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                          <HiOutlineExclamationCircle /> Expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-blue-700 dark:text-blue-300 italic">
            You haven’t enrolled in any counseling plan yet. Explore plans to get started with expert guidance!
          </p>
        )}
      </div>

      {/* Premium Tools */}
      <div>
        <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-2">
          🛠️ Your Purchased Tools
        </h2>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
                <Skeleton height={16} width={160} />
                <Skeleton height={12} width={140} className="mt-2" />
              </div>
            ))}
          </div>
        ) : premiumTools.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {premiumTools.map((tool, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-lg p-4 border border-orange-100 dark:border-orange-700"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-orange-800 dark:text-orange-200 font-semibold text-base">
                      {tool?.toolId?.title || 'Premium Tool'}
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Purchased on: {formatDate(tool.purchasedOn)}
                    </p>
                  </div>
                  <SparklesIcon className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-orange-700 dark:text-orange-300 italic">
            No tools purchased yet. Unlock premium tools to boost your preparation!
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
