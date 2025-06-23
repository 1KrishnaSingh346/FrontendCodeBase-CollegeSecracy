import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { FullScreenLoader } from '../../components/Loaders/script.js';
import { formatNumber } from '../../utils/formatNumber';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminHome = () => {
  const { AllUsers, fetchAllUsers, isfetchingUser } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    mentors: 0,
    students: 0,
    newThisWeek: 0,
    hasToolsOrPlans: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchAllUsers();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchAllUsers]);

  useEffect(() => {
    if (AllUsers && AllUsers.length > 0) {
      calculateStats();
    }
  }, [AllUsers]);

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const statsData = {
      totalUsers: AllUsers.length,
      activeToday: AllUsers.filter(user => {
        return user.lastActive && new Date(user.lastActive) >= today;
      }).length,
      hasToolsOrPlans: AllUsers.filter(user => 
        (user.premiumTools && user.premiumTools.length > 0) || 
        (user.counselingPlans && user.counselingPlans.length > 0)
      ).length,
      mentors: AllUsers.filter(user => user.role === 'mentor').length,
      students: AllUsers.filter(user => user.role === 'mentee').length,
      newThisWeek: AllUsers.filter(user => {
        return user.createdAt && new Date(user.createdAt) >= oneWeekAgo;
      }).length
    };

    setStats(statsData);
    generateRecentActivity();
  };

  const generateRecentActivity = () => {
    const sortedUsers = [...AllUsers].sort((a, b) => {
      return new Date(b.lastActive) - new Date(a.lastActive);
    });

    const recentUsers = sortedUsers.slice(0, 5);

    const activity = recentUsers.map(user => ({
      id: user._id,
      name: user.fullName || 'Unknown User',
      action: user.lastActive ? 'Was active' : 'Registered',
      time: user.lastActive || user.createdAt,
      role: user.role,
       profilePic: user.profilePic?.url || null,
  avatarText: (!user.profilePic?.url && user.fullName)
    ? user.fullName.charAt(0).toUpperCase()
    : 'U',
      hasSubscription: (user.premiumTools && user.premiumTools.length > 0) || 
                      (user.counselingPlans && user.counselingPlans.length > 0)
    }));

    setRecentActivity(activity);
  };

  if (isfetchingUser || isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <Skeleton height={32} width={200} className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border">
              <Skeleton height={24} width={120} />
              <Skeleton height={32} className="mt-2" />
              {i === 0 && <Skeleton height={20} width={100} className="mt-1" />}
              {i === 2 && (
                <div className="flex justify-between mt-2">
                  <Skeleton height={20} width={80} />
                  <Skeleton height={20} width={80} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded-lg">
            <Skeleton height={24} width={150} className="mb-4" />
            <div className="flex justify-between">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1/3 text-center">
                  <Skeleton height={28} className="mx-auto" width={60} />
                  <Skeleton height={16} width={80} className="mt-1 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <Skeleton height={24} width={150} className="mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={48} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <Skeleton height={24} width={150} className="mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center mb-4">
              <Skeleton circle width={40} height={40} className="mr-3" />
              <div className="flex-1">
                <Skeleton height={16} width={120} />
                <Skeleton height={14} width={180} className="mt-1" />
              </div>
              <Skeleton height={20} width={60} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Total Users Card */}
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-blue-800">Total Users</h3>
              <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{formatNumber(stats.totalUsers)}</p>
            </div>
            <div className="text-xs md:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              +{formatNumber(stats.newThisWeek)} this week
            </div>
          </div>
        </div>
        
        {/* Active Today Card */}
        <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-100">
          <h3 className="text-sm md:text-base font-semibold text-green-800">Active Today</h3>
          <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{formatNumber(stats.activeToday)}</p>
          <p className="text-xs md:text-sm text-green-600 mt-1">
            {stats.totalUsers > 0 ? 
              `${Math.round((stats.activeToday / stats.totalUsers) * 100)}% of total` : 
              'No users'}
          </p>
        </div>
        
        {/* Subscriptions Card */}
        <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm md:text-base font-semibold text-purple-800">Subscriptions</h3>
          <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{formatNumber(stats.hasToolsOrPlans)}</p>
          <div className="flex justify-between mt-2 text-xs md:text-sm">
            <span className="text-purple-600">{formatNumber(stats.mentors)} Mentors</span>
            <span className="text-purple-600">{formatNumber(stats.students)} Students</span>
          </div>
        </div>
      </div>
      
      {/* Distribution and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* User Distribution */}
        <div className="bg-white border rounded-lg p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3 md:mb-4">User Distribution</h3>
          <div className="flex justify-between text-center">
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.mentors}</div>
              <div className="text-xs md:text-sm text-gray-500">Mentors</div>
            </div>
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-green-600">{stats.students}</div>
              <div className="text-xs md:text-sm text-gray-500">Students</div>
            </div>
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{stats.hasToolsOrPlans}</div>
              <div className="text-xs md:text-sm text-gray-500">Subscribed</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
<div className="bg-white border rounded-lg p-3 md:p-4">
  <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3 md:mb-4">Quick Actions</h3>
  <div className="grid grid-cols-2 gap-2 md:gap-3">
    <Link to="/admin/users" className="cursor-pointer">
      <button className="w-full bg-blue-50 text-blue-700 p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-100 transition cursor-pointer">
        Add New User
      </button>
    </Link>

    <Link to="/admin/plan-event-management" className="cursor-pointer">
      <button className="w-full bg-green-50 text-green-700 p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-green-100 transition cursor-pointer">
        Send Announcement
      </button>
    </Link>

    <Link to="/admin/payment-analytics" className="cursor-pointer">
      <button className="w-full bg-purple-50 text-purple-700 p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-100 transition cursor-pointer">
        View Reports
      </button>
    </Link>

    <Link to="/admin/plan-event-management" className="cursor-pointer">
      <button className="w-full bg-yellow-50 text-yellow-700 p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-yellow-100 transition cursor-pointer">
        Manage Subs
      </button>
    </Link>
  </div>
</div>
      </div>
      
      {/* Recent Activity */}
<div className="bg-white border rounded-lg p-3 md:p-4">
  <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3 md:mb-4">Recent Activity</h3>
  {recentActivity.length > 0 ? (
    <div className="space-y-3 md:space-y-4 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
      {recentActivity.map(activity => (
        <div key={activity.id} className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden mr-2 md:mr-3">
            {activity.profilePic ? (
              <img
                src={activity.profilePic}
                alt={activity.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-sm md:text-base">
                  {activity.avatarText}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
              {activity.name}
              {activity.hasSubscription && (
                <span className="ml-1 text-xs text-purple-600">★</span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {activity.action} {formatTimeAgo(activity.time)}
            </p>
          </div>

          <span className={`ml-2 px-1 md:px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${activity.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
              activity.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'}`}>
            {activity.role === 'mentee' ? 'Student' : activity.role}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-xs md:text-sm text-gray-500">No recent activity</p>
  )}
</div>


    </div>
  );
};

// Helper function to format time ago
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  
  return 'just now';
}

export default AdminHome;