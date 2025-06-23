// App.jsx
import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "./store/useAuthStore.js";
import { InitialLoader, FullScreenLoader } from "./components/Loaders/script.js";
import { ErrorBoundary as ErrorBoundaryReact } from "react-error-boundary";
import { Toaster, toast } from 'react-hot-toast';

// Lazy Imports
import {LoginPage, SignupPage } from "./pages/AuthForm.jsx";

// const AuthForm = React.lazy(() => import("./pages/AuthForm"));
const Home = React.lazy(() => import("./pages/Home"));
const Search = React.lazy(() => import("./pages/Search"));
const Payment = React.lazy(() => import("./pages/Payment"));
const Profile = React.lazy(() => import("./pages/Profile"));
const AdminDashboard = React.lazy(() => import("./pages/AdminPages/AdminDashboard.jsx"));
const MenteePage = React.lazy(() => import("./pages/MenteePage"));
const MentorPage = React.lazy(() => import("./pages/MentorPage"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
const TermsAndConditions = React.lazy(() => import("./pages/Policies/TermsAndConditions.jsx"));
const PrivacyPolicy = React.lazy(() => import("./pages/Policies/PrivacyPolicy.jsx"));
const CookiePolicy = React.lazy(() => import("./pages/Policies/CookiePolicy.jsx"));
const RefundPolicy = React.lazy(() => import("./pages/Policies/RefundPolicy.jsx"));
const CollegeDataTable = React.lazy(() => import("./pages/CollegeDataTable"));
const ToolsPage = React.lazy(() => import("./pages/ToolPage"));
const RankCalculator = React.lazy(() => import("./pages/tools/RankCalculator"));
const PercentileCalculator = React.lazy(() => import("./pages/tools/PercentileCalculator"));
const CollegePredictor = React.lazy(() => import("./pages/tools/CollegePredictor"));
const StateCollegePredictor = React.lazy(() => import("./pages/tools/StateCollegePredictor"));
const CGPACalculator = React.lazy(() => import("./pages/tools/CGPACalculator"));
const StudyPlanner = React.lazy(() => import("./pages/tools/StudyPlanner.jsx"));
const ResourcesComingSoon = React.lazy(() => import("./pages/StudentPages/ComingSoon/ResourcesComingSoon.jsx"));
const MockTestsComingSoon = React.lazy(() => import("./pages/StudentPages/ComingSoon/MockTestsComingSoon.jsx"));
const ProgressComingSoon = React.lazy(() => import("./pages/StudentPages/ComingSoon/ProgressComingSoon.jsx"));
const BranchComparison = React.lazy(() => import("./pages/tools/BranchComparison.jsx"));
const MentalHealthComponent = React.lazy(() => import("./pages/StudentPages/Components/MentalHealthComponent.jsx"));
const AdminHome = React.lazy(() => import("./pages/AdminPages/AdminHome.jsx"));
const AdminUsers = React.lazy(() => import("./pages/AdminPages/AdminUsers.jsx"));
const AdminSettings = React.lazy(() => import("./pages/AdminPages/AdminSettings.jsx"));
const AdminCollegeData = React.lazy(() => import("./pages/AdminPages/AdminCollegeData.jsx"));
const AdminPlanAndEventManagement = React.lazy(() => import("./pages/AdminPages/adminPlanAndEventManagement.jsx"));
const AdminPaymentAnalytics = React.lazy(() => import("./pages/AdminPages/AdminPaymentAnalytics.jsx"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail.jsx"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword.jsx"));
import DashboardLayout from "./pages/Layouts/DashboardLayout.jsx";

const ErrorBoundary = ({ children }) => {
  const [errorInfo, setErrorInfo] = useState(null);

  const handleReset = () => {
    setErrorInfo(null);
    window.location.reload();
  };

  return errorInfo ? (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <details className="mb-4">
          <summary className="cursor-pointer">Details</summary>
          <pre className="mt-2 text-sm">{errorInfo?.componentStack}</pre>
        </details>
        <button onClick={handleReset} className="px-4 py-2 bg-blue-600 text-white rounded">Try Again</button>
      </div>
    </div>
  ) : (
    <ErrorBoundaryReact onError={(err, info) => setErrorInfo(info)} FallbackComponent={() => null}>
      {children}
    </ErrorBoundaryReact>
  );
};

// Public Route (no auth check)
const PublicRoute = ({ children }) => {
  const { user, initialAuthCheckComplete } = useAuthStore();
  const location = useLocation();

  if (!initialAuthCheckComplete) {
    return <InitialLoader fullScreen />; // Wait till auth check completes
  }

  if (user) {
    const redirectMap = {
      admin: "/admin",
      mentor: "/mentor-dashboard",
      mentee: "/mentee-dashboard",
    };
    return <Navigate to={redirectMap[user.role] || "/"} replace state={{ from: location }} />;
  }

  return children;
};

// Protected Route (with auth + role)
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, initialAuthCheckComplete, isCheckingAuth } = useAuthStore();
  const location = useLocation();

if ((isCheckingAuth && !initialAuthCheckComplete) || !initialAuthCheckComplete) {
  return <InitialLoader fullScreen />;
}

  if (!user) return <Navigate to="/" replace state={{ from: location }} />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

function AppContent() {
  const { user, initializeAuth, initialAuthCheckComplete, authError } = useAuthStore();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const location = useLocation();

  // useEffect(() => {
  //   // Run initializeAuth only if cookie exists
  //   if (!initialAuthCheckComplete && document.cookie.includes("jwt")) {
  //     initializeAuth();
  //   }
  // }, [initialAuthCheckComplete]);

  useEffect(() => {
  initializeAuth();
}, []);


useEffect(() => {
  const message = sessionStorage.getItem('logoutMessage');
  if (message) {
    toast.success(message, {
      duration: 3000,
      style: { background: '#4BB543', color: '#fff' }
    });
    sessionStorage.removeItem('logoutMessage'); // Clear it after showing
  }
}, []);


//   useEffect(() => {
//   const publicPaths = ['/', '/login','/signup', '/verify-email',"/reset-password", '/about', '/contact', '/terms', '/privacy', '/cookies', '/refund'];
//   const isPublicRoute = publicPaths.includes(location.pathname);

//   if (!initialAuthCheckComplete && !isPublicRoute) {
//     initializeAuth();
//   } else {
//     useAuthStore.setState({ initialAuthCheckComplete: true }); // Skip auth check for public pages
//   }
// }, [initialAuthCheckComplete, location.pathname, initializeAuth]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isPaymentProcessing && <FullScreenLoader message="Processing Payment..." />}

      {authError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Auth Error</p>
                <p className="text-sm">{authError}</p>
              </div>
              <button onClick={() => useAuthStore.getState().clearError()} className="ml-2">&times;</button>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<InitialLoader fullScreen />}>
        <Routes location={location} key={location.key}>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/datatest" element={<CollegeDataTable />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment setIsPaymentProcessing={setIsPaymentProcessing} /></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorPage /></ProtectedRoute>} />
          <Route path="/mentee-dashboard" element={<ProtectedRoute allowedRoles={["mentee"]}><MenteePage /></ProtectedRoute>} />

          <Route path="/:dashboardType" element={<DashboardLayout />}>
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="tools/college-predictor" element={<CollegePredictor />} />
            <Route path="tools/rank-calculator" element={<RankCalculator />} />
            <Route path="tools/percentile-calculator" element={<PercentileCalculator />} />
            <Route path="tools/state-college-predictor" element={<StateCollegePredictor />} />
            <Route path="tools/cgpa-calculator" element={<CGPACalculator />} />
            <Route path="tools/study-planner" element={<StudyPlanner />} />
            <Route path="tools/branch-comparison" element={<BranchComparison />} />
            <Route path="resources/mental-health" element={<MentalHealthComponent />} />
            <Route path="resources" element={<ResourcesComingSoon />} />
            <Route path="tests" element={<MockTestsComingSoon />} />
            <Route path="progress" element={<ProgressComingSoon />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="college-data" element={<AdminCollegeData />} />
            <Route path="plan-event-management" element={<AdminPlanAndEventManagement />} />
            <Route path="payment-analytics" element={<AdminPaymentAnalytics />} />
          </Route>

          <Route path="/unauthorized" element={
            <div className="flex justify-center items-center h-screen text-center">
              <div>
                <h1 className="text-2xl text-red-600 font-bold">Access Denied</h1>
                <p>You don’t have permission to view this page</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.history.back()}>Go Back</button>
              </div>
            </div>
          } />

          <Route path="*" element={
            <div className="flex justify-center items-center h-screen text-center">
              <div>
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn’t exist.</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.href = "/"}>Go to Homepage</button>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>

      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: "#363636", color: "#fff" } }} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
