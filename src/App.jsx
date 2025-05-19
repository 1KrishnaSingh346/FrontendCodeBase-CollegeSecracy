import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "./store/useAuthStore.js";
import { InitialLoader, FullScreenLoader } from "./components/Loaders/script.js";
import { ErrorBoundary as ErrorBoundaryReact } from "react-error-boundary";

// Lazy-loaded components with proper chunk names
const AuthForm = React.lazy(() => import(/* webpackChunkName: "auth" */ "./pages/AuthForm"));
const Home = React.lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const Search = React.lazy(() => import(/* webpackChunkName: "search" */ "./pages/Search"));
const Payment = React.lazy(() => import(/* webpackChunkName: "payment" */ "./pages/Payment"));
const Profile = React.lazy(() => import(/* webpackChunkName: "profile" */ "./pages/Profile"));
const AdminDashboard = React.lazy(() => import(/* webpackChunkName: "admin" */ "./pages/AdminPages/AdminDashboard.jsx"));
const MenteePage = React.lazy(() => import(/* webpackChunkName: "mentee" */ "./pages/MenteePage"));
const MentorPage = React.lazy(() => import(/* webpackChunkName: "mentor" */ "./pages/MentorPage"));
const AboutUs = React.lazy(() => import(/* webpackChunkName: "about" */ "./pages/AboutUs"));
const ContactUs = React.lazy(() => import(/* webpackChunkName: "contact" */ "./pages/ContactUs"));
const TermsAndConditions = React.lazy(() => import(/* webpackChunkName: "legal" */ "./pages/Policies/TermsAndConditions.jsx"));
const PrivacyPolicy = React.lazy(() => import(/* webpackChunkName: "legal" */ "./pages/Policies/PrivacyPolicy.jsx"));
const CookiePolicy = React.lazy(() => import(/* webpackChunkName: "legal" */ "./pages/Policies/CookiePolicy.jsx"));
const CollegeDataTable = React.lazy(() => import(/* webpackChunkName: "data" */ "./pages/CollegeDataTable"));
const ToolsPage = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/ToolPage"));
const RankCalculator = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/RankCalculator"));
const PercentileCalculator = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/PercentileCalculator"));
const CollegePredictor = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/CollegePredictor"));
const StateCollegePredictor = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/StateCollegePredictor"));
const CGPACalculator = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/CGPACalculator"));
const MarkingScheme = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/MarkingScheme"));
const CutoffAnalyzer = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/CutoffAnalyzer"));
const ExamTools = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/ExamTools"));
const StudyPlanner = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/StudyPlanner.jsx"));
import CollegePredictorService from "./pages/tools/CollegePredictorService.jsx";
const ResourcesPage = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/StudentPages/ResourcesPage.jsx"));
const MockTestPage = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/StudentPages/MockTestPage.jsx"));
const ProgressPage = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/StudentPages/ProgressPage.jsx"));
const ResourcesComingSoon = React.lazy(() => import(/* webpackChunkName: "coming-soon" */ "./pages/StudentPages/ComingSoon/ResourcesComingSoon.jsx"));
const MockTestsComingSoon = React.lazy(() => import(/* webpackChunkName: "coming-soon" */ "./pages/StudentPages/ComingSoon/MockTestsComingSoon.jsx"));
const ProgressComingSoon = React.lazy(() => import(/* webpackChunkName: "coming-soon" */ "./pages/StudentPages/ComingSoon/ProgressComingSoon.jsx"));
const BranchComparison = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/tools/BranchComparison.jsx"));
const MentalHealthComponent = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/StudentPages/Components/MentalHealthComponent.jsx"));
const AdminHome = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/AdminPages/AdminHome.jsx"));
const AdminUsers = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/AdminPages/AdminUsers.jsx"));
const AdminSettings = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/AdminPages/AdminSettings.jsx"));
const AdminCollegeData = React.lazy(() => import(/* webpackChunkName: "tools" */ "./pages/AdminPages/AdminCollegeData.jsx"));

import DashboardLayout from "./pages/Layouts/DashboardLayout.jsx";



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

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user) {
    return (
      <Navigate 
        to={user.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard"} 
        state={{ from: location }}
        replace 
      />
    );
  }

  return children;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { 
    user, 
    isCheckingAuth, 
    initialAuthCheckComplete 
  } = useAuthStore();
  const location = useLocation();

  // Show loader while auth is being checked
  if (isCheckingAuth || !initialAuthCheckComplete) {
    return <InitialLoader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/authForm" state={{ from: location }} replace />;
  }

  // Debug logs
  // console.log("ProtectedRoute - User:", user);
  // console.log("ProtectedRoute - User role:", user.role);
  // console.log("ProtectedRoute - Allowed roles:", allowedRoles);

  // More robust role comparison
  const normalizedUserRole = String(user.role).toLowerCase().trim();
  const normalizedAllowedRoles = allowedRoles.map(r => String(r).toLowerCase().trim());
  
  const hasRequiredRole = allowedRoles.length === 0 || 
    normalizedAllowedRoles.includes(normalizedUserRole);

  if (!hasRequiredRole) {
    console.warn(
      `Access denied. User role: ${user.role}, ` +
      `Required roles: ${allowedRoles.join(', ')}, ` +
      `Normalized comparison: ${normalizedUserRole} vs [${normalizedAllowedRoles.join(', ')}]`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

function AppContent() {
  const { 
    user, 
    error: authError,
    initialAuthCheckComplete,
    initializeAuth
  } = useAuthStore();
  
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!initialAuthCheckComplete) {
    return <InitialLoader fullScreen />;
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Global loading indicator for payments */}
      {isPaymentProcessing && <FullScreenLoader message="Processing payment..." />}
      
      {/* Global error notification */}
      {authError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">Authentication Error</p>
                <p className="text-sm">{authError}</p>
              </div>
              <button 
                onClick={() => useAuthStore.getState().clearError()}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<InitialLoader fullScreen />}>
        <Routes location={location} key={location.key}>
          {/* Public Routes */}
          <Route path="/" element={
            <ErrorBoundary>
              <PublicRoute>
                <Home />
              </PublicRoute>
            </ErrorBoundary>
          } />
          
          <Route path="/search" element={
            <ErrorBoundary>
              <Search />
            </ErrorBoundary>
          } />
          
          <Route path="/payment" element={
            <ErrorBoundary>
              <Payment setIsPaymentProcessing={setIsPaymentProcessing} />
            </ErrorBoundary>
          } />
          
          <Route path="/about" element={
            <ErrorBoundary>
              <AboutUs />
            </ErrorBoundary>
          } />
          
          <Route path="/contact" element={
            <ErrorBoundary>
              <ContactUs />
            </ErrorBoundary>
          } />
          
          <Route path="/terms" element={
            <ErrorBoundary>
              <TermsAndConditions />
            </ErrorBoundary>
          } />
          
          <Route path="/privacy" element={
            <ErrorBoundary>
              <PrivacyPolicy />
            </ErrorBoundary>
          } />

<Route path="/cookies" element={
            <ErrorBoundary>
              <CookiePolicy />
            </ErrorBoundary>
          } />
          
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center p-6 max-w-md">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Access Denied
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You don't have permission to view this page
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          } />

          {/* Tools Routes */}
          <Route path="/tools" element={
            <ErrorBoundary>
              <ToolsPage />
            </ErrorBoundary>
          } />
          
          

          {/* Authentication */}
<Route
  path="/authForm"
  element={
    <ErrorBoundary>
      {user ? (
        <Navigate
          to={
            user.role.toLowerCase() === "admin"
              ? "/admin"
              : user.role.toLowerCase() === "mentor"
              ? "/mentor-dashboard"
              : "/mentee-dashboard"
          }
          replace
        />
      ) : (
        <AuthForm />
      )}
    </ErrorBoundary>
  }
/>

          {/* Protected Routes */}
          <Route path="/mentor-dashboard" element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/mentee-dashboard" element={
            <ProtectedRoute allowedRoles={["mentee"]}>
              <MenteePage />
            </ProtectedRoute>
          } />
          

  {/* Dashboard Layout with Nested Routes */}
  <Route path="/:dashboardType" element={<DashboardLayout />}>
    <Route
      path="profile"
      element={
        <ProtectedRoute allowedRoles={["mentee", "mentor"]}>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route path="tools/college-predictor" element={
            <ErrorBoundary>
              <CollegePredictor />
            </ErrorBoundary>
    } />

<Route path="tools/rank-calculator" element={
            <ErrorBoundary>
              <RankCalculator />
            </ErrorBoundary>
          } />
          
          <Route path="tools/percentile-calculator" element={
            <ErrorBoundary>
              <PercentileCalculator />
            </ErrorBoundary>
          } />
          
        

          <Route path="tools/state-college-predictor" element={
            <ErrorBoundary>
              <StateCollegePredictor />
            </ErrorBoundary>
          } />
          
          <Route path="tools/cgpa-calculator" element={
            <ErrorBoundary>
              <CGPACalculator />
            </ErrorBoundary>
          } />
          
          {/* <Route path="/tools/college-predictor-services" element={
            <ErrorBoundary>
              <CollegePredictorService/>
            </ErrorBoundary>
          } /> */}

          <Route path="tools/branch-comparison" element={
            <ErrorBoundary>
              <BranchComparison />
            </ErrorBoundary>
          } />

{/*           
          <Route path="/tools/marking-scheme" element={
            <ErrorBoundary>
              <MarkingScheme />
            </ErrorBoundary>
          } /> */}
          
          {/* <Route path="/tools/cutoff-analyzer" element={
            <ErrorBoundary>
              <CutoffAnalyzer />
            </ErrorBoundary>
          } /> */}
          
          {/* <Route path="/tools/exam-tools" element={
            <ErrorBoundary>
              <ExamTools />
            </ErrorBoundary>
          } /> */}
          
          <Route path="tools/study-planner" element={
            <ErrorBoundary>
              <StudyPlanner />
            </ErrorBoundary>
          } />

          <Route path="resources/mental-health" element={
            <ErrorBoundary>
              <MentalHealthComponent />
            </ErrorBoundary>
          } />

          <Route path="resources" element={
            <ErrorBoundary>
              <ResourcesComingSoon />
            </ErrorBoundary>
          } />
                    
                    <Route path="tests" element={
            <ErrorBoundary>
              <MockTestsComingSoon />
            </ErrorBoundary>
          } />
                    <Route path="progress" element={
            <ErrorBoundary>
              <ProgressComingSoon />
            </ErrorBoundary>
          } />

  </Route>

          
          <Route path="/datatest" element={
            <ErrorBoundary>
              <CollegeDataTable />
            </ErrorBoundary>
          } />
                    

          
<Route path="/admin" element={
  <ErrorBoundary>
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  </ErrorBoundary>
}>
  <Route index element={<AdminHome />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="settings" element={<AdminSettings />} />
  <Route path="college-data" element={<AdminCollegeData/>} />
</Route>
{/* 
          <Route
          path="/admin"
          element={<AdminDashboard/>}
          /> */}

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center p-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                  onClick={() => window.location.href = "/"}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

// App Wrapper with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;