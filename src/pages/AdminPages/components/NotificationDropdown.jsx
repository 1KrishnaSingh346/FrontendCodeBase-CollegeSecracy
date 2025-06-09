// components/NotificationDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const {
    notifications,
    loadingNotifications,
    fetchNotifications,
    markNotificationAsRead,
    getUnreadCount
  } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const unreadCount = getUnreadCount();

  // Filter to only show unread notifications
  const unreadNotifications = notifications.filter(notification => !notification.isRead);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown opens and periodically every 10 seconds
  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Set up interval for periodic fetching
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000); // 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // Update position when dropdown opens and on window resize
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      updateDropdownPosition();
      
      const handleResize = () => {
        updateDropdownPosition();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    updateDropdownPosition();
    setIsOpen(!isOpen);
  };

  // Navigation logic based on notification type
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'feedback_submitted':
      case 'feedback_updated':
        navigate('/admin/users');
        break;
      case 'payment_processed':
        navigate('/admin/payment-management');
        break;
      case 'user_registered':
        navigate('/admin/users');
        break;
      default:
        navigate('/admin/users');
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative" ref={buttonRef}>
        <button 
          onClick={toggleDropdown}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
          aria-label="Notifications"
        >
          <FiBell className="text-xl md:text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed sm:absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 max-h-[calc(100vh-100px)] overflow-y-auto border border-gray-200 dark:border-gray-700"
          style={{
            top: `${dropdownPosition.top}px`,
            left: 'auto',
            right: '16px',
            width: 'calc(100vw - 32px)',
            maxWidth: '24rem'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2 px-2 sticky top-0 bg-white dark:bg-gray-800 py-2">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  unreadNotifications.forEach(n => handleMarkAsRead(n._id));
                }}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {loadingNotifications ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : unreadNotifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">No unread notifications</p>
          ) : (
            <ul className="space-y-2">
              {unreadNotifications.map(notification => (
                <li 
                  key={notification._id} 
                  className={`p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-blue-50 dark:bg-blue-900/20`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.metadata && (
                        <div className="mt-2 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          {notification.type === 'feedback_updated' && (
                            <div className="space-y-1">
                              <p className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Previous:</span>
                                <span>{notification.metadata.previousValues.starRating} stars</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">New:</span>
                                <span>{notification.metadata.newValues.starRating} stars</span>
                              </p>
                            </div>
                          )}
                          {notification.type === 'payment_processed' && (
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                              <span>${notification.metadata.amount}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 self-start ml-2 p-1"
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      <FiCheck size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;