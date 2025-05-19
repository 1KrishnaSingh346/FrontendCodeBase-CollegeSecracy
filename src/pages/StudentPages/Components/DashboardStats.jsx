import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import React from 'react';



const DashboardStats = ({ user }) => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
      };
    const stats = [
      {
        name: 'Study Hours',
        value: '28.5',
        change: '+12%',
        changeType: 'positive',
        icon: (
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: 'Mock Test Score',
        value: '87%',
        change: '+5%',
        changeType: 'positive',
        icon: (
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: 'Syllabus Covered',
        value: '64%',
        change: '+8%',
        changeType: 'positive',
        icon: (
          <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      },
      {
        name: 'Streak Days',
        value: user.premium ? '14' : '5',
        change: user.premium ? '+9' : '+2',
        changeType: 'positive',
        premium: true,
        icon: (
          <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      }
    ];
  
    return (
      <motion.div 
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Study Dashboard
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, statIdx) => (
              <div 
                key={statIdx}
                className={`p-4 rounded-lg border ${
                  stat.premium && !user.premium 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {stat.premium && !user.premium ? 'Premium' : stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    stat.premium && !user.premium 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                {stat.change && (
                  <div className={`mt-2 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <span>{stat.change}</span>{' '}
                    <span>vs last week</span>
                  </div>
                )}
                {stat.premium && !user.premium && (
                  <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center">
                    <FiLock className="mr-1" /> Upgrade to unlock
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Today's Study Goal</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: '45%' }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium text-blue-700 dark:text-blue-300">45%</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-blue-700 dark:text-blue-300">
                <span>2.7/6 hours</span>
                <span>Ends at 10 PM</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-lg p-4 border border-orange-100 dark:border-orange-900/30">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Upcoming Deadline</h3>
              <div className="flex items-center">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-2 rounded-lg mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Physics Mock Test</h4>
                  <p className="text-xs text-orange-700 dark:text-orange-300">Due tomorrow at 8 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );

  const PlanStatusCard = ({ plan, user }) => {
  if (!user.counselingPlans?.[plan]) return null;

  const planData = user.counselingPlans[plan];
  const isValid = new Date(planData.validUntil) > new Date();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white capitalize">
            {plan.replace(/([A-Z])/g, ' $1')} Plan
          </h3>
          <p className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {isValid ? 'Active' : 'Expired'} - Valid until {new Date(planData.validUntil).toLocaleDateString()}
          </p>
        </div>
        {isValid && plan === 'whatsapp' && planData.whatsappGroupLink && (
          <a 
            href={planData.whatsappGroupLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full"
          >
            Join Group
          </a>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Purchased on {new Date(planData.purchasedOn).toLocaleDateString()}
      </div>
    </div>
  );
};
  };

  export default DashboardStats;