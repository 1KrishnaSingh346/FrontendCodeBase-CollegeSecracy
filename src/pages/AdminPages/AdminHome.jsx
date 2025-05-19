import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { FullScreenLoader } from '../../components/Loaders/script.js';
import { formatNumber } from '../../utils/formatNumber';

const AdminHome = () => {
  const { AllUsers, fetchAllUsers, isfetchingUser } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    mentors: 0,
    mentees: 0,
    newThisWeek: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAllUsers();
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
      premiumUsers: AllUsers.filter(user => user.premium).length,
      mentors: AllUsers.filter(user => user.role === 'mentor').length,
      mentees: AllUsers.filter(user => user.role === 'mentee').length,
      newThisWeek: AllUsers.filter(user => {
        return user.createdAt && new Date(user.createdAt) >= oneWeekAgo;
      }).length
    };

    setStats(statsData);
    generateRecentActivity();
  };

  const generateRecentActivity = () => {
    // Sort users by lastActive date (newest first)
    const sortedUsers = [...AllUsers].sort((a, b) => {
      return new Date(b.lastActive) - new Date(a.lastActive);
    });

    // Take the 5 most recent active users
    const recentUsers = sortedUsers.slice(0, 5);

    // Format as activity items
    const activity = recentUsers.map(user => ({
      id: user._id,
      name: user.fullName || 'Unknown User',
      action: user.lastActive ? 'Was active' : 'Registered',
      time: user.lastActive || user.createdAt,
      role: user.role,
      avatarText: user.fullName?.charAt(0) || 'U'
    }));

    setRecentActivity(activity);
  };

  if (isfetchingUser) {
    return <FullScreenLoader message="Loading dashboard data..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-blue-800">Total Users</h3>
              <p className="text-2xl md:text-3xl font-bold mt-2">{formatNumber(stats.totalUsers)}</p>
            </div>
            <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              +{formatNumber(stats.newThisWeek)} this week
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800">Active Today</h3>
          <p className="text-2xl md:text-3xl font-bold mt-2">{formatNumber(stats.activeToday)}</p>
          <p className="text-sm text-green-600 mt-1">
            {stats.totalUsers > 0 ? 
              `${Math.round((stats.activeToday / stats.totalUsers) * 100)}% of total` : 
              'No users'}
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-100">
          <h3 className="font-semibold text-purple-800">Premium Users</h3>
          <p className="text-2xl md:text-3xl font-bold mt-2">{formatNumber(stats.premiumUsers)}</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-purple-600">{formatNumber(stats.mentors)} mentors</span>
            <span className="text-purple-600">{formatNumber(stats.mentees)} mentees</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-4">User Distribution</h3>
          <div className="flex justify-between text-center">
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.mentors}</div>
              <div className="text-sm text-gray-500">Mentors</div>
            </div>
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-green-600">{stats.mentees}</div>
              <div className="text-sm text-gray-500">Mentees</div>
            </div>
            <div className="w-1/3">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{stats.premiumUsers}</div>
              <div className="text-sm text-gray-500">Premium</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-100 transition">
              Add New User
            </button>
            <button className="bg-green-50 text-green-700 p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-green-100 transition">
              Send Announcement
            </button>
            <button className="bg-purple-50 text-purple-700 p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-100 transition">
              View Reports
            </button>
            <button className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-xs md:text-sm font-medium hover:bg-yellow-100 transition">
              Manage Subscriptions
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center">
                <div className="flex-shrink-0 md:h-10 h-8 w-8 md:w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">{activity.avatarText}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {activity.action} {formatTimeAgo(activity.time)}
                  </p>
                </div>
                <span className={`md:px-2 px-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${activity.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    activity.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {activity.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

// Helper function to format time ago (you can put this in your utils)
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