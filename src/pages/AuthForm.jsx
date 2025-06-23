import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { PageLoader } from "../components/Loaders/script.js";
import toast, { Toaster } from "react-hot-toast";
import Logo from "/Logo.webp";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiRefreshCw,FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import EmailActionModal from "../components/Modals/EmailActionModal.jsx";
import { Loader2 } from "lucide-react";


// Background SVG Component
const AuthBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <svg
      className="absolute top-0 left-0 w-full h-full text-gray-100 dark:text-gray-800 opacity-50"
      preserveAspectRatio="none"
      viewBox="0 0 1200 1200"
    >
      <path
        fill="currentColor"
        d="M0 0v1200h1200V0H0zm50 50h1100v1100H50V50zm100 100h900v900H150V150z"
      />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-blue-50/20 dark:from-gray-900/80 dark:to-gray-800/80"></div>
  </div>
);

// Common Auth Layout Component
const AuthLayout = ({ children, title, subtitle, linkText, linkPath }) => {
  const [darkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <AuthBackground />
      <Toaster />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} className="h-12 w-40 md:h-16 md:w-60" alt="collegesecracy" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
            {subtitle}
          </p>
        </div>

        {children}

        {linkText && linkPath && (
  <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
    {linkText}{" "}
    <Link
      to={linkPath}
      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none transition-colors inline-flex items-center"
    >
      Create one <FiArrowRight className="ml-1" />
    </Link>
  </p>
)}

      </motion.div>
    </div>
  );
};

// Login Page Component
export const LoginPage = () => {
  const { 
    login, 
    isAuthenticated, 
    isLoading, 
    user, 
    error, 
    clearError,
    reSendVerificationEmail, 
    sendResetReactivateEmail, 
    checkVerificationStatus 
  } = useAuthStore();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [requestTimeout, setRequestTimeout] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [emailType, setEmailType] = useState('verify');
  const [lockCountdown, setLockCountdown] = useState(null);

  // Countdown timer for lock period
  useEffect(() => {
    let interval;
    if (lockCountdown > 0) {
      interval = setInterval(() => {
        setLockCountdown(prev => prev - 1);
      }, 1000);
    } else if (lockCountdown === 0) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.__accountLocked;
        delete newErrors.__lockTimeLeft;
        return newErrors;
      });
    }
    return () => clearInterval(interval);
  }, [lockCountdown]);

  // Resend cooldown timer
  useEffect(() => {
    if (emailSent && resendCooldown > 0) {
      const interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [emailSent, resendCooldown]);

  // Initialize form with remembered credentials
  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true";
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (remember && storedEmail && storedPassword) {
      setFormState(prev => ({
        ...prev,
        email: storedEmail,
        password: storedPassword,
        rememberMe: true
      }));
    }
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Verification status polling
  useEffect(() => {
    if (!emailSent || !formState.email) return;

    let intervalId;

    const startPolling = async () => {
      intervalId = setInterval(async () => {
        try {
          const res = await checkVerificationStatus(formState.email, emailType);

          const isVerified =
            emailType === "reset" ? res?.isPasswordChanged :
            emailType === "reactivation" ? res?.isReactivated :
            res?.isVerified;

          if (isVerified) {
            clearInterval(intervalId);
            setEmailSent(false);

            if (emailType === "verify") {
              toast.success("✅ Email verified! Please login.");
            } else if (emailType === "reset") {
              toast.success("✅ Password changed! You can now login.");
            } else if (emailType === "reactivation") {
              toast.success("✅ Account reactivated! Please login.");
            }

            navigate("/login");
          }
        } catch (err) {
          console.error("🔁 Polling failed:", err);
        }
      }, 5000);
    };

    startPolling();

    return () => clearInterval(intervalId);
  }, [emailSent, formState.email, emailType, navigate]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "mentee" ? "/mentee-dashboard" : "/admin");
    }
  }, [isAuthenticated, user, navigate]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      handleAuthError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleAuthError = (error) => {
    setFormErrors({});
    if (toastId) toast.dismiss(toastId);

    let errorMessage = "An unexpected error occurred. Please try again.";
    const newFormErrors = {};
    let showToast = true;

    if (error.type) {
      switch (error.type) {
        case 'timeout':
          errorMessage = "Request timed out. Please try again.";
          setRequestTimeout(true);
          break;
        case 'network':
          errorMessage = "Network error. Please check your connection.";
          break;
        case 'invalid_credentials':
          errorMessage = "Invalid email or password";
          newFormErrors.email = errorMessage;
          newFormErrors.password = errorMessage;
          showToast = false;
          break;
        case 'validation':
          if (error.errors?.length > 0) {
            error.errors.forEach(err => {
              if (err.path && err.msg) newFormErrors[err.path] = err.msg;
            });
            showToast = false;
          } else {
            errorMessage = error.message || "Validation error";
          }
          break;
        case 'deactivated_account':
          errorMessage = error.message || "Your account has been deactivated";
          newFormErrors.email = errorMessage;
          if (error.deactivatedAt) newFormErrors.__deactivatedAt = error.deactivatedAt;
          if (error.deactivationReason) newFormErrors.__deactivationReason = error.deactivationReason;
          showToast = false;
          break;
        case 'verify_account':
          errorMessage = error.message || "Verify your email before login";
          newFormErrors.email = errorMessage;
          newFormErrors.__needsVerification = true;
          showToast = false;
          break;
        case 'account_locked':
          errorMessage = error.message || "Account temporarily locked";
          newFormErrors.__accountLocked = true;
          if (error.lockTimeLeft) {
            const minutes = error.lockTimeLeft;
            newFormErrors.__lockTimeLeft = minutes;
            setLockCountdown(minutes * 60); // Convert minutes to seconds
            errorMessage += `. Try again in ${minutes} minute(s).`;
          }
          break;
        default:
          errorMessage = error.message || "Something went wrong";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    setFormErrors(newFormErrors);
    setIsSubmitting(false);

    if (showToast && errorMessage) {
      const newToastId = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setToastId(newToastId);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formState.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!formState.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || formErrors.__accountLocked) return;

    setIsSubmitting(true);
    setRequestTimeout(false);
    setFormErrors({});
    
    try {
      if (formState.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", formState.email.trim());
        localStorage.setItem("password", formState.password);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      await login({
        email: formState.email.trim(),
        password: formState.password
      });
      
      showTemporaryMessage("Logged in successfully!", "success");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const showTemporaryMessage = (msg, type = "error") => {
    if (toastId) toast.dismiss(toastId);

    const options = {
      duration: 5000,
      position: "top-center",
      style: {
        background: type === "error" ? "#FEE2E2" : "#DCFCE7",
        color: type === "error" ? "#B91C1C" : "#166534",
        border: type === "error" ? "1px solid #FCA5A5" : "1px solid #86EFAC",
        padding: "16px",
        borderRadius: "8px"
      }
    };

    const newToastId = type === "error" 
      ? toast.error(msg, options) 
      : toast.success(msg, options);
    
    setToastId(newToastId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSend = async (email, type) => {
    try {
      const res = await sendResetReactivateEmail(email, type);

      if (res.success) {
        setEmailSent(true);
        setResendCooldown(60);
        toast.success(`✅ ${type === 'reset' ? 'Password reset' : 'Reactivation'} email sent!`);
      } else {
        toast.error(res.message || "Something went wrong", "error");
      }
    } catch (err) {
      toast.error("Send failed, please try again.", "error");
    }
  };

  const handleResend = async (email, type) => {
    try {
      const res = await reSendVerificationEmail(email, type);

      if (res.success) {
        setEmailSent(true);
        setResendCooldown(60);
        toast.success(`✅ ${type === 'verify' ? 'Verification' : type === 'reset' ? 'Password reset' : 'Reactivation'} email resent!`);
      } else {
        toast.error(res.message || "Something went wrong", "error");
      }
    } catch (err) {
      toast.error("Resend failed, please try again.", "error");
    }
  };

  const handleGoogleLogin = () => {
    const newToastId = toast(
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
        <span>Google login will be available in the next update!</span>
      </div>,
      {
        duration: 4000,
        icon: "ℹ️",
        style: {
          background: "#EFF6FF",
          color: "#1E40AF",
          border: "1px solid #93C5FD",
          padding: "16px",
          borderRadius: "8px"
        }
      }
    );
    setToastId(newToastId);
  };

  if (isInitializing) return <PageLoader />;

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey"
      linkText={!emailSent ? "Don't have an account?" : undefined}
      linkPath={!emailSent ? "/signup" : undefined} 
    >
      {emailSent ? (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
            {emailType === "verify"
              ? "Verification Email Sent"
              : emailType === "reset"
              ? "Password Reset Email Sent"
              : "Reactivation Link Sent"}
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-300 max-w-sm">
            We've sent an email to <span className="font-medium">{formState.email}</span>.  
            Please check your inbox or spam folder.
          </p>

          <button
            onClick={() => handleResend(formState.email, emailType)}
            disabled={isLoading || resendCooldown > 0}
            className={`px-4 py-2 rounded-md text-white flex items-center justify-center gap-2 transition ${
              isLoading || resendCooldown > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              `Resend ${
                emailType === "verify"
                  ? "Verification"
                  : emailType === "reset"
                  ? "Password Reset"
                  : "Reactivation"
              } Email`
            )}
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <FiMail className="mr-2 text-orange-500" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  formErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 transition`}
                placeholder="your@email.com"
                disabled={formErrors.__accountLocked}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.email}</p>
              )}

              {formErrors.__needsVerification && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 rounded-md text-center space-y-2">
                  <p className="text-sm font-medium">Your email is not verified.</p>
                  <button
                    onClick={() => {
                      handleResend(formState.email, "verify");
                      setEmailType("verify");
                    }}
                    type="button"
                    disabled={isLoading}
                    className={`w-full max-w-xs px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium rounded-md transition text-white ${
                      isLoading
                        ? "bg-orange-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </button>
                </div>
              )}

              {formErrors.email?.toLowerCase().includes("deactivated") && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded text-sm text-yellow-900 dark:text-yellow-200">
                  <button
                    onClick={() => {
                      setShowReactivationModal(true);
                      setEmailType("reactivation");
                    }}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition"
                  >
                    <FiRefreshCw className="h-4 w-4" />
                    Request Reactivation
                  </button>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <FiLock className="mr-2 text-blue-500" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 pr-10 focus:ring-2 focus:ring-blue-500 transition`}
                  placeholder="••••••••"
                  disabled={formErrors.__accountLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  disabled={formErrors.__accountLocked}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.password}</p>
              )}
            </div>

            {/* Account Locked Message */}
            {formErrors.__accountLocked && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
                <div className="flex items-start">
                  <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-300" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Account Temporarily Locked
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>
                        Too many failed login attempts. Your account has been locked for security reasons.
                      </p>
                      {lockCountdown > 0 && (
                        <p className="mt-2">
                          Time remaining: <span className="font-semibold">
                            {Math.floor(lockCountdown / 60)} minute(s) {lockCountdown % 60} second(s)
                          </span>
                        </p>
                      )}
                      <p className="mt-2">
                        If you've forgotten your password, you can{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setShowResetModal(true);
                            setEmailType("reset");
                          }}
                          className="font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
                        >
                          reset it here
                        </button>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Remember Me + Forgot Password */}
            {!formErrors.__accountLocked && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formState.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 accent-orange-500 dark:accent-blue-500 rounded"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-300">
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(true);
                    setEmailType("reset");
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {requestTimeout && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                Request timed out. Please check your connection and try again.
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: formErrors.__accountLocked ? 1 : 1.02 }}
              whileTap={{ scale: formErrors.__accountLocked ? 1 : 0.98 }}
              className={`w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex justify-center items-center shadow-md ${
                formErrors.__accountLocked 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-orange-600 hover:to-blue-700'
              }`}
              disabled={isSubmitting || formErrors.__accountLocked}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Hold tight, logging you in...</span>
                </>
              ) : formErrors.__accountLocked ? (
                'Account Locked'
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {!formErrors.__accountLocked && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span className="ml-2">Continue with Google</span>
                </motion.button>
              </div>
            </div>
          )}
        </>
      )}

      <EmailActionModal
        isOpen={showReactivationModal}
        setIsOpen={setShowReactivationModal}
        onSend={(email, type) => handleSend(email, type)}
        type="reactivation"
        initialEmail={formState.email}
      />

      <EmailActionModal
        isOpen={showResetModal}
        setIsOpen={setShowResetModal}
        onSend={(email, type) => handleSend(email, type)}
        type="reset"
        initialEmail={formState.email}
      />
    </AuthLayout>
  );
};

export const SignupPage = () => {
  const { signup, isAuthenticated, user, error, clearError , checkVerificationStatus, reSendVerificationEmail } = useAuthStore();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword,           setShowPassword] = useState(false);
  const [showConfirmPassword,    setShowConfirmPassword] = useState(false);
  const [isSubmitting,           setIsSubmitting] = useState(false);
  const [passwordStrength,       setPasswordStrength] = useState("");
  const [formErrors,             setFormErrors] = useState({});
  const [requestTimeout,        setRequestTimeout] = useState(false);
  const [toastId,               setToastId] = useState(null);
  const [isInitializing,        setIsInitializing] = useState(true);

  const [emailSent,            setEmailSent] = useState(false);
  const [resendCooldown,      setResendCooldown] = useState(60);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "mentee" ? "/mentee-dashboard" : "/admin");
    }
  }, [isAuthenticated, user, navigate]);

  // Handle errors from auth store
  useEffect(() => {
    if (error) {
      handleAuthError(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
  if (!emailSent || !formState.email) return;

  const interval = setInterval(async () => {
    try {
      const res = await checkVerificationStatus(formState.email, "verify");
      if (res.isVerified) {
        setEmailSent(false);
        showToast("✅ Your email has been successfully verified. Please sign in to continue.", "success");
        navigate("/login");
      }
    } catch (err) {
      console.error("Polling failed:", err);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [emailSent, formState.email]);


  // Initialization loader
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Password strength
  useEffect(() => {
    if (formState.password) {
      setPasswordStrength(calculatePasswordStrength(formState.password));
    } else {
      setPasswordStrength("");
    }
  }, [formState.password]);

  // Resend cooldown handler
  useEffect(() => {
    if (emailSent && resendCooldown > 0) {
      const interval = setInterval(() => {
        setResendCooldown(p => p - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [emailSent, resendCooldown]);

  const calculatePasswordStrength = password => {
    const checks = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
      password.length >= 8
    ];
    const score = checks.filter(Boolean).length;
    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const handleAuthError = err => {
    setFormErrors({});
    if (toastId) toast.dismiss(toastId);

    let msg = "An unexpected error occurred.";
    const errs = {};
    let showToast = true;

    if (err.type) {
      switch (err.type) {
        case "timeout":
          msg = "Request timed out.";
          setRequestTimeout(true);
          break;
        case "network":
          msg = "Network error. Check connection.";
          break;
        case "validation":
          if (err.errors?.length) {
            err.errors.forEach(e => {
              if (e.path) errs[e.path] = e.msg;
            });
            showToast = false;
          } else msg = err.message || msg;
          break;
        case "email_conflict":
          msg = "Email already registered.";
          errs.email = msg;
          showToast = false;
          break;
        default:
          msg = err.message || msg;
      }
    } else if (err.message) msg = err.message;

    setFormErrors(errs);
    setIsSubmitting(false);

    if (showToast && msg) {
      const id = toast.error(msg, { position: "top-right", autoClose: 5000 });
      setToastId(id);
    }
  };

  const validateForm = () => {
    const errs = {};
    let ok = true;

    if (!formState.fullName.trim()) {
      errs.fullName = "Full name is required"; ok = false;
    }
    if (!formState.password) {
      errs.password = "Password is required"; ok = false;
    } else if (formState.password.length < 6) {
      errs.password = "Password must be 6+ characters"; ok = false;
    }
    if (formState.password !== formState.confirmPassword) {
      errs.confirmPassword = "Passwords must match"; ok = false;
    }
    if (!formState.email.trim()) {
      errs.email = "Email is required"; ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errs.email = "Enter a valid email"; ok = false;
    }

    setFormErrors(errs);
    return ok;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setRequestTimeout(false);
    setFormErrors({});

    try {
      const res = await signup({
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        password: formState.password,
        role: "mentee"
      });

      if (res.success) {
        setEmailSent(true);
        setResendCooldown(60);
        showToast(`Verification email sent to ${formState.email}`, "success");
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleResend = async () => {
  try {
    const res = await reSendVerificationEmail(formState.email, "verify");

    if (res.success) {
      setResendCooldown(10);
      showToast("✅ Verification email resent!", "success");
    } else {
      // Handle known server-side messages
      const msg = res.message || "Something went wrong.";
      showToast(msg, "error");
    }

  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Resend failed due to a network/server error.";
    showToast(msg, "error");
  }
};



  const showToast = (msg, type = "error") => {
    if (toastId) toast.dismiss(toastId);
    const opts = {
      duration: 5000,
      position: "top-center",
      style: {
        background: type === "error" ? "#FEE2E2" : "#DCFCE7",
        color: type === "error" ? "#B91C1C" : "#166534",
        border: type === "error" ? "1px solid #FCA5A5" : "1px solid #86EFAC",
        padding: "16px",
        borderRadius: "8px"
      }
    };
    const id = type === "error" ? toast.error(msg, opts) : toast.success(msg, opts);
    setToastId(id);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(s => ({ ...s, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(e => ({ ...e, [name]: "" }));
    }
  };

  const handleGoogleLogin = () => {
    const content = (
      <div className="flex items-center space-x-2">
        <FiMail className="text-blue-500" />
        <span>Google login coming soon!</span>
      </div>
    );
    const id = toast(content, {
      duration: 4000,
      icon: "ℹ️",
      style: {
        background: "#EFF6FF",
        color: "#1E40AF",
        border: "1px solid #93C5FD",
        padding: "16px",
        borderRadius: "8px"
      }
    });
    setToastId(id);
  };

  if (isInitializing) return <PageLoader />;

  return (
<AuthLayout
  title={emailSent ? "Verify Your Email" : "Create Account"}
  subtitle={
    emailSent
      ? `We've sent a verification link to ${formState.email}`
      : "Join our learning community!"
  }
  linkText={emailSent ? "" : "Already have an account?"}
  linkPath={emailSent ? "" : "/login"}
>

      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             <div className="flex items-center">
               <FiUser className="mr-2 text-orange-500" />
               Full Name
             </div>
               </label>
              <input
            type="text"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              formErrors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition`}
            placeholder="John Doe"
          />
          {formErrors.fullName && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center">
              <FiMail className="mr-2 text-orange-500" />
              Email Address
            </div>
          </label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              formErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition`}
            placeholder="your@email.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center">
              <FiLock className="mr-2 text-blue-500" />
              Password
            </div>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                formErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.password}</p>
          )}
          {passwordStrength && (
            <div className="mt-1 text-xs flex items-center">
              <span className="mr-2">Strength:</span>
              <span className={
                passwordStrength === "Weak" ? "text-red-500 font-medium" :
                passwordStrength === "Medium" ? "text-yellow-500 font-medium" :
                "text-green-500 font-medium"
              }>
                {passwordStrength}
              </span>
              <div className="ml-2 flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    passwordStrength === "Weak" ? "bg-red-500 w-1/3" :
                    passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" :
                    "bg-green-500 w-full"
                  }`}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center">
              <FiLock className="mr-2 text-orange-500" />
              Confirm Password
            </div>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.confirmPassword}</p>
          )}
        </div>

        {requestTimeout && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            Request timed out. Please check your connection and try again.
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex justify-center items-center shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Welcome aboard! Setting things up...</span>
            </>
          ) : (
            "Create Account"
          )}
        </motion.button>
      </form>
      ) : (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Didn't get the email?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`px-4 py-2 rounded-md text-white transition ${
              resendCooldown > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend Verification Email"}
          </button>
        </div>
      )}

      {!emailSent && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <FiMail className="w-5 h-5" />
              <span className="ml-2">Continue with Google</span>
            </motion.button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
