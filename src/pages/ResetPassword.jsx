import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setIsVerifying(true);
      if (!token || !email) {
        setIsTokenValid(false);
        toast.error("Invalid reset link. Missing token or email.");
        setIsVerifying(false);
        return;
      }

      try {
        const res = await verifyEmail(token, email, "reset");
        if (!res.success) {
          setIsTokenValid(false);
          toast.error(res.message || "This reset link has expired or is invalid.");
        }
      } catch (error) {
        setIsTokenValid(false);
        toast.error("Failed to verify reset link. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    checkTokenValidity();
  }, [token, email]);

  useEffect(() => {
    if (!isTokenValid) {
      const timer = setTimeout(() => navigate("/login"), 6000);
      return () => clearTimeout(timer);
    }
  }, [isTokenValid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: "", strength: 0 };
    if (password.length < 8) return { text: "Too short", strength: 0 };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&#]/.test(password);
    
    const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    
    const strengthText = 
      strength === 4 ? "Strong" :
      strength === 3 ? "Good" :
      strength === 2 ? "Fair" :
      "Weak";
    
    return { text: strengthText, strength };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const { text: strength } = getPasswordStrength(formData.password);

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (strength === "Weak") {
      errors.password = "Password is too weak";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsResetting(true);
    try {
      const res = await resetPassword(token, email, formData.password);

      if (res?.success) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        if (res?.message && res.message.toLowerCase().includes("same as the old")) {
          setFormErrors((prev) => ({
            ...prev,
            password: "New password cannot be the same as the old one.",
          }));
          toast.error("Try a different password. This one matches your old password.");
        } else {
          toast.error(res?.message || "Password reset failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred during password reset. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const { text: passwordStrength, strength: strengthLevel } = getPasswordStrength(formData.password);
  const strengthColors = ["text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 relative overflow-hidden">
      {/* Background SVG elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-500"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      {isVerifying ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-gray-300 font-medium">Verifying reset link...</p>
          <p className="text-xs text-gray-500">Please wait while we validate your request</p>
        </div>
      ) : (
        <div className="bg-gray-800 text-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-700 space-y-6 z-10 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="text-gray-400 text-sm">
              {isTokenValid 
                ? "Enter a new password for your account" 
                : "This password reset link is no longer valid"}
            </p>
          </div>

          {!isTokenValid ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">
                    This password reset link is invalid or has expired.
                  </p>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    For your security, reset links are time-bound and become invalid after use.
                    <br />
                    You'll be automatically redirected to the login page in a few seconds.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    disabled={isResetting}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    disabled={isResetting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {(passwordFocused || formData.password) && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Strength</span>
                      <span className={`text-xs font-medium ${strengthColors[strengthLevel] || 'text-gray-400'}`}>
                        {passwordStrength || "Too short"}
                      </span>
                    </div>
                    <div className="w-full mt-1 bg-gray-600 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          strengthLevel === 1
                            ? "bg-red-500"
                            : strengthLevel === 2
                            ? "bg-yellow-500"
                            : strengthLevel === 3
                            ? "bg-blue-500"
                            : strengthLevel === 4
                            ? "bg-green-500"
                            : "bg-transparent"
                        }`}
                        style={{ width: `${(strengthLevel / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isResetting}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    disabled={isResetting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isResetting}
                className={`w-full py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2
                  ${isResetting 
                    ? "bg-indigo-800 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"}
                `}
              >
                {isResetting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;