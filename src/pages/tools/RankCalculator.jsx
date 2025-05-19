import { useState, useEffect } from "react";
import { 
  TrashIcon, 
  ClipboardIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  SunIcon, 
  MoonIcon,
  BoltIcon,
  TrophyIcon,
  CalculatorIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import { marksToPercentile } from "../../utils/CollegeData.js";
import axios from "axios"; // For API calls

const jeeHeroImage = "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80";
const successImage = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// API configuration
const API_BASE_URL = "https://your-api-endpoint.com/api";
const API_ENDPOINTS = {
  saveCalculation: "/calculations",
  verifyMobile: "/verify-mobile",
  sendOtp: "/send-otp"
};

const RankCalculator = () => {
  // State variables
  const [inputType, setInputType] = useState("score");
  const [score, setScore] = useState("");
  const [percentileInput, setPercentileInput] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [dob, setDob] = useState("");
  const [rank, setRank] = useState(null);
  const [percentile, setPercentile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);

  // Candiates Appear
  const candidatesAppeared = 1475103; // Total candidates appeared in JEE Main 2025

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Load saved preferences
  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
      document.documentElement.classList.toggle('dark', savedDarkMode);
    }
    
    const savedHistory = JSON.parse(localStorage.getItem('jee-rank-history')) || [];
    setHistory(savedHistory);
  }, []);

  // Calculate percentile from marks using exact data
  const calculateExactPercentile = (marks) => {
    const entry = marksToPercentile.find(
      e => marks >= e.minMarks && marks <= e.maxMarks
    );
    
    if (!entry) return 0;
    
    // Linear interpolation within the range
    if (entry.minMarks === entry.maxMarks) {
      return entry.minPercentile;
    }
    
    const rangeRatio = (marks - entry.minMarks) / (entry.maxMarks - entry.minMarks);
    const percentile = entry.minPercentile + rangeRatio * (entry.maxPercentile - entry.minPercentile);
    
    return Math.min(100, Math.max(0, percentile));
  };

  // Calculate rank from percentile
  const calculateRank = (percentile) => {
    const rank = Math.round(((100 - percentile) * candidatesAppeared) / 100);
    return Math.max(1, rank);
  };

  // API call to send OTP
  const sendOtp = async () => {
    if (!mobile.match(/^[6-9]\d{9}$/)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.sendOtp}`, {
        mobile
      });
      
      if (response.data.success) {
        setOtpSent(true);
        alert(`OTP sent to ${mobile}`);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // API call to verify OTP
  const verifyOtp = async () => {
    if (!otp.match(/^\d{6}$/)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.verifyMobile}`, {
        mobile,
        otp
      });
      
      if (response.data.success) {
        setOtpVerified(true);
        alert("Mobile number verified successfully!");
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // API call to save calculation to database
  const saveCalculationToDB = async (calculation) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.saveCalculation}`, {
        ...calculation,
        userId: localStorage.getItem('userId') // If you have user authentication
      });
      
      return response.data.success;
    } catch (err) {
      console.error("Failed to save to database:", err);
      return false;
    }
  };

  // Main calculation function
  const calculateJeeRank = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let calculatedPercentile;

      if (inputType === "score") {
        const marks = parseFloat(score);
        if (isNaN(marks) || marks < 0 || marks > 300) {
          alert("Please enter valid marks between 0 and 300");
          return;
        }
        calculatedPercentile = calculateExactPercentile(marks);
      } else {
        calculatedPercentile = parseFloat(percentileInput);
        if (isNaN(calculatedPercentile) || calculatedPercentile < 0 || calculatedPercentile > 100) {
          alert("Please enter valid percentile between 0 and 100");
          return;
        }
      }

      const calculatedRank = calculateRank(calculatedPercentile);
      
      setRank(calculatedRank);
      setPercentile(calculatedPercentile);
      
      const calculation = { 
        inputType,
        ...(inputType === "score" && { marks: parseFloat(score) }),
        percentile: calculatedPercentile,
        rank: calculatedRank,
        mobile: otpVerified ? mobile : null,
        applicationNo,
        dob,
        timestamp: new Date().toISOString()
      };
      
      // Update local history
      const updatedHistory = [calculation, ...history.slice(0, 4)];
      setHistory(updatedHistory);
      localStorage.setItem('jee-rank-history', JSON.stringify(updatedHistory));
      
      // Save to database if mobile is verified
      if (otpVerified) {
        const savedToDB = await saveCalculationToDB(calculation);
        if (!savedToDB) {
          console.warn("Failed to save to database, but continued with local storage");
        }
      }
      
    } catch (error) {
      setError("An error occurred during calculation. Please try again.");
      console.error("Calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy results to clipboard
  const copyResult = () => {
    const text = `JEE Main Rank Prediction\n` +
      `${inputType === "score" ? `Score: ${score}/300\n` : `Percentile: ${percentileInput}%\n`}` +
      `Predicted Rank: ${rank.toLocaleString()}\n` +
      `Percentile: ${percentile.toFixed(2)}%\n` +
      `Application No: ${applicationNo || 'Not specified'}\n` +
      `DOB: ${dob || 'Not specified'}`;
    
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  // Delete a history item
  const deleteHistoryItem = async (index) => {
    if (window.confirm("Are you sure you want to delete this calculation?")) {
      const itemToDelete = history[index];
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      
      setHistory(updatedHistory);
      localStorage.setItem('jee-rank-history', JSON.stringify(updatedHistory));
      
      // Optionally delete from database if you have IDs
      if (itemToDelete.id) {
        try {
          await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.saveCalculation}/${itemToDelete.id}`);
        } catch (err) {
          console.error("Failed to delete from database:", err);
        }
      }
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('jee-rank-history');
      
      // Optionally clear from database
      try {
        await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.saveCalculation}/clear`, {
          params: { userId: localStorage.getItem('userId') }
        });
      } catch (err) {
        console.error("Failed to clear database history:", err);
      }
    }
  };

  // Load a calculation from history
  const loadCalculation = (calc) => {
    if (calc.inputType === "score") {
      setScore(calc.marks?.toString() || "");
    } else {
      setPercentileInput(calc.percentile?.toString() || "");
    }
    setPercentile(calc.percentile);
    setRank(calc.rank);
    setApplicationNo(calc.applicationNo || "");
    setMobile(calc.mobile || "");
    setDob(calc.dob || "");
    setOtpVerified(!!calc.mobile);
    setInputType(calc.inputType || "score");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`transition-colors duration-300 min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Back to Home/Tools button - Mobile responsive */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm py-2 px-4`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a 
            href="/tools" 
            className={`flex items-center text-sm md:text-base ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
          >
            <ArrowLeftIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <span className="font-medium">Back to Tools</span>
          </a>
          <a 
            href="/" 
            className={`flex items-center text-sm md:text-base ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
          >
            <HomeIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <span className="font-medium">Home</span>
          </a>
        </div>
      </div>

      {/* Dark/Light mode toggle - Mobile responsive */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-14 md:top-16 right-3 z-50 p-2 rounded-full bg-gray-300 dark:bg-gray-700 shadow-lg hover:scale-110 transition-transform"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <SunIcon className="h-7 w-7 text-yellow-400" />
        ) : (
          <MoonIcon className="h-7 w-7 text-gray-700" />
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${darkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'}`}>
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section - Mobile responsive */}
        <div className={`rounded-xl p-4 md:p-6 mb-6 md:mb-8 ${darkMode ? 'bg-gradient-to-br from-blue-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-200'} shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">
                JEE Main Rank Predictor
              </h1>
              <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-blue-200' : 'text-blue-100'}`}>
                Get accurate rank predictions based on your score or percentile
              </p>
              <div className="flex items-center mt-2 md:mt-4">
                <BoltIcon className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white text-sm md:text-base font-medium">Instant Results</span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
              <img 
                src={jeeHeroImage} 
                alt="Students preparing for JEE" 
                className="h-40 md:h-48 lg:h-64 object-contain rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Calculator - Mobile responsive */}
        <div className={`rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <CalculatorIcon className="h-5 w-5 mr-2" />
            Enter Your Details
          </h2>
          
          {/* Input Type Toggle */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Input Type
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={inputType === "score"}
                  onChange={() => setInputType("score")}
                />
                <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Score (0-300)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={inputType === "percentile"}
                  onChange={() => setInputType("percentile")}
                />
                <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Percentile (0-100)</span>
              </label>
            </div>
          </div>

          {/* Score/Percentile Input */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {inputType === "score" ? "Enter Your JEE Main Score" : "Enter Your Percentile"}
            </label>
            <input
              type="number"
              value={inputType === "score" ? score : percentileInput}
              onChange={(e) => inputType === "score" 
                ? setScore(e.target.value) 
                : setPercentileInput(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              min="0"
              max={inputType === "score" ? 300 : 100}
              step={inputType === "percentile" ? "0.01" : "1"}
              placeholder={inputType === "score" ? "e.g., 185" : "e.g., 97.5"}
            />
          </div>

          {/* Application Number */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Application Number (Optional)
            </label>
            <input
              type="text"
              value={applicationNo}
              onChange={(e) => setApplicationNo(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              placeholder="e.g., 123456789"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Mobile Verification */}
          <div className="mb-6 md:mb-8">
            <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mobile Number (for report)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={otpVerified}
                className={`flex-1 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} ${otpVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="10-digit mobile number"
              />
              {!otpVerified ? (
                <button
                  onClick={sendOtp}
                  disabled={loading || !mobile.match(/^[6-9]\d{9}$/)}
                  className={`px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {loading ? "Sending..." : "Get OTP"}
                </button>
              ) : (
                <div className={`flex items-center px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-green-500`}>
                  Verified ✓
                </div>
              )}
            </div>
            
            {otpSent && !otpVerified && (
              <div className="mt-3">
                <label className={`block mb-2 text-sm md:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enter OTP
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`flex-1 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                    placeholder="6-digit OTP"
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    className={`px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base font-medium ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateJeeRank}
            disabled={loading || (inputType === "score" ? !score : !percentileInput)}
            className={`w-full py-3 px-4 md:py-4 md:px-6 rounded-lg text-sm md:text-base font-bold text-white transition-colors flex items-center justify-center ${darkMode ? 'bg-orange-600 hover:bg-orange-500' : 'bg-orange-500 hover:bg-orange-600'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <TrophyIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Predict My Rank
              </>
            )}
          </button>
        </div>

        {/* Results Display */}
        {rank !== null && (
          <div className={`rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4 md:mb-6">
              <img 
                src={successImage} 
                alt="Success" 
                className="h-12 w-12 md:h-16 md:w-16 mr-3 md:mr-4 rounded-full" 
              />
              <div>
                <h3 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Prediction Results
                </h3>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Based on your {inputType === "score" ? "score" : "percentile"}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className={`p-4 md:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-blue-500' : 'bg-blue-50 border-blue-300'}`}>
                <h4 className={`text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  <ChartBarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Predicted Rank
                </h4>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl md:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {rank.toLocaleString()}
                  </span>
                  <span className={`text-xs md:text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    out of {candidatesAppeared.toLocaleString()} candidates
                  </span>
                </div>
              </div>
              
              <div className={`p-4 md:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-purple-500' : 'bg-purple-50 border-purple-300'}`}>
                <h4 className={`text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  <AcademicCapIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Percentile
                </h4>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl md:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {percentile.toFixed(2)}%
                  </span>
                  <span className={`text-xs md:text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Top {percentile.toFixed(2)}% students
                  </span>
                </div>
              </div>
            </div>

            {/* JEE Insights */}
            <div className={`p-3 md:p-4 rounded-lg mb-4 md:mb-6 ${darkMode ? 'bg-gray-700 border-blue-500' : 'bg-blue-50 border-blue-200'} border`}>
              <h4 className={`text-sm md:text-base font-semibold flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                <AcademicCapIcon className="h-4 w-4 md:h-5 md:w-5" />
                JEE Main Insights
              </h4>
              <p className={`mt-1 md:mt-2 text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rank ≤ {(rank * 0.8).toLocaleString()} might qualify for JEE Advanced
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Based on previous year trends (approx.)
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={copyResult}
                className={`flex items-center gap-2 py-2 px-4 md:py-3 md:px-6 rounded-lg text-sm md:text-base font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors`}
              >
                <ClipboardIcon className="h-4 w-4 md:h-5 md:w-5" />
                Copy Results
              </button>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className={`rounded-xl shadow-lg p-4 md:p-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className={`text-lg md:text-xl font-bold flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <ChartBarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Previous Calculations
              </h3>
              <button 
                onClick={clearAllHistory}
                className={`text-xs md:text-sm font-medium ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'} transition-colors`}
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto pr-2">
              {history.map((item, index) => (
                <div 
                  key={`${item.timestamp}-${index}`} 
                  onClick={() => loadCalculation(item)}
                  className={`p-3 md:p-4 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3 md:gap-4">
                        <span className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Rank: {item.rank.toLocaleString()}
                        </span>
                        <span className={`text-xs md:text-sm ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                          {item.percentile.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mt-1 text-xs md:text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {item.inputType === "score" ? `Score: ${item.marks?.toFixed(0) || 0}/300` : `Percentile Input`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(index);
                      }}
                      className={`p-1 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                    >
                      <TrashIcon className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankCalculator;