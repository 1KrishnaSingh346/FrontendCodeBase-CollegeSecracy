import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore.js';
import { FullScreenLoader } from '../../components/Loaders/script.js';
import { ErrorBoundary as ErrorBoundaryReact } from "react-error-boundary";
import NotificationDropdown from './components/NotificationDropdown.jsx';
import { FiHome, FiUsers, FiClipboard, FiBarChart2, FiDatabase, FiSettings } from "react-icons/fi";

// Enhanced Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [errorInfo, setErrorInfo] = useState(null);

  const handleReset = () => {
    setErrorInfo(null);
    window.location.reload();
  };

  return errorInfo ? (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong
        </h2>
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300">
            Error details
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
            {errorInfo.componentStack}
          </pre>
        </details>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  ) : (
    <ErrorBoundaryReact 
      onError={(error, info) => {
        console.error("ErrorBoundary caught an error:", error, info);
        setErrorInfo(info);
      }}
      FallbackComponent={() => null}
    >
      {children}
    </ErrorBoundaryReact>
  );
};

const AdminDashboard = () => {
  const { user, isCheckingAuth, logout, loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUser();
        
        if (!user) {
          navigate('/authForm');
          return;
        }
        
        if (user.role !== 'admin') {
          navigate('/unauthorized');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/authForm');
      }
    };

    checkAuth();
  }, [loadUser, navigate]);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isCheckingAuth || isLoading) {
    return <FullScreenLoader message="Verifying admin access..." />;
  }

const handleLogout = async () => {
  try {
    await logout();
    // Store message before redirect
    sessionStorage.setItem('logoutMessage', 'Logged out successfully 👋');
    navigate('/');
  } catch (err) {
    toast.error('Logout failed. Please try again.', {
      duration: 3000,
      style: { background: '#D32F2F', color: '#fff' }
    });
  }
};

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Sidebar - Desktop */}
        <div 
          className={`hidden md:flex flex-col bg-indigo-700 text-white ${
            sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 ease-in-out fixed h-full z-40`}
        >
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
            ) : (
              <span className="text-xl font-bold">A</span>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full hover:bg-indigo-600 focus:outline-none"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          <nav className="mt-6 overflow-y-auto flex-1">
             <NavItem 
    icon={<FiHome className="w-6 h-6" />}
    text="Dashboard"
    active
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin')}
  />

  <NavItem 
    icon={<FiUsers className="w-6 h-6" />}
    text="Manage Users"
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin/users')}
  />

  <NavItem 
    icon={<FiClipboard className="w-6 h-6" />}
    text="Manage Plans And Events"
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin/plan-event-management')}
  />

  <NavItem 
    icon={<FiBarChart2 className="w-6 h-6" />}
    text="Payment Analytics"
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin/payment-analytics')}
  />

  <NavItem 
    icon={<FiDatabase className="w-6 h-6" />}
    text="Manage College Data"
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin/college-data')}
  />

  <NavItem 
    icon={<FiSettings className="w-6 h-6" />}
    text="Settings"
    sidebarOpen={sidebarOpen}
    onClick={() => navigate('/admin/settings')}
  />
          </nav>
        </div>

        {/* Sidebar - Mobile */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-64 h-full bg-indigo-700 text-white">
              <div className="p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-indigo-600 focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="mt-6 overflow-y-auto flex-1">
                <NavItem 
  icon={<FiHome className="w-6 h-6" />}
  text="Dashboard"
  active
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin');
    setMobileSidebarOpen(false);
  }}
/>

<NavItem 
  icon={<FiUsers className="w-6 h-6" />}
  text="Manage Users"
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin/users');
    setMobileSidebarOpen(false);
  }}
/>

<NavItem 
  icon={<FiClipboard className="w-6 h-6" />}
  text="Manage Plans And Events"
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin/plan-event-management');
    setMobileSidebarOpen(false);
  }}
/>

<NavItem 
  icon={<FiBarChart2 className="w-6 h-6" />}
  text="Payment Analytics"
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin/payment-analytics');
    setMobileSidebarOpen(false);
  }}
/>

<NavItem 
  icon={<FiDatabase className="w-6 h-6" />}
  text="Manage College Data"
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin/college-data');
    setMobileSidebarOpen(false);
  }}
/>

<NavItem 
  icon={<FiSettings className="w-6 h-6" />}
  text="Settings"
  sidebarOpen={true}
  onClick={() => {
    navigate('/admin/settings');
    setMobileSidebarOpen(false);
  }}
/>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}>
          {/* Header */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">Admin Dashboard</h2>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <NotificationDropdown />
                </div>
                
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    className="flex items-center space-x-1 sm:space-x-2 focus:outline-none"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                      {user?.fullName?.charAt(0) || 'A'}
                    </div>
                    <span className="hidden sm:inline text-sm sm:text-base text-gray-700 truncate max-w-xs">
                      {user?.fullName || 'Admin'}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        profileDropdownOpen ? 'transform rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium truncate">{user?.email}</div>
                        <div className="text-xs text-gray-500">Admin</div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const NavItem = ({ icon, text, active = false, sidebarOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 mt-2 ${
        active ? 'bg-indigo-600' : 'hover:bg-indigo-600'
      } rounded-lg transition-colors duration-200 focus:outline-none`}
    >
      <span className={`${active ? 'text-white' : 'text-indigo-200'}`}>
        {icon}
      </span>
      {sidebarOpen && (
        <span className="ml-4 font-medium">{text}</span>
      )}
    </button>
  );
};

export default AdminDashboard;