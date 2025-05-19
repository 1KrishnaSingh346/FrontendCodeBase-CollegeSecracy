import { useState, useEffect, useRef, useCallback } from "react";
import { 
  saveCalculation, 
  getCalculations, 
  clearToolHistory,
  deleteHistoryItem as deleteHistoryItemUtil 
} from "../../utils/tools";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CollegeReportPDF from "../../components/tools/CollegeReportPDF";
import { generatePDFBuffer } from "../../components/tools/CollegeReportPDF";
import { 
  EnvelopeIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/outline";
import { fetchCollegeData } from "../../utils/parseCollegeData";

// SVG Illustrations
import CollegeIllustration from "../../assets/CollegeIllustration.webp";
import EmptyStateIllustration from "../../assets/EmptyStateIllustration.webp";

const Notification = ({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed md:top-4 top-3 right-3 md:right-4 z-50 transform transition-all duration-300 ${
      message ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`md:p-4 p-1 rounded-lg md:text-base text-sm shadow-lg ${
        isError ? 'bg-red-500' : 'bg-green-500'
      } text-white flex items-center justify-between min-w-[300px] max-w-[90vw]`}>
        <div>
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const CollegePredictor = () => {
  const TOOL_NAME = 'college-predictor';
  const [rank, setRank] = useState("");
  const [seatType, setSeatType] = useState("OPEN");
  const [quota, setQuota] = useState("HS");
  const [gender, setGender] = useState("Gender-Neutral");
  const [round, setRound] = useState(1);
  const [counsellingType, setCounsellingType] = useState("CSAB");
  const [collegeData, setCollegeData] = useState([]);
  const [predictedColleges, setPredictedColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [displayedColleges, setDisplayedColleges] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [history, setHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', isError: false });
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const formRef = useRef(null);

  const collegesPerPage = 5;

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const showNotificationMessage = (message, isError = false) => {
    setNotification({ message, isError });
    setShowNotification(true);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  // Data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCollegeData(counsellingType, round);
        setCollegeData(data);

        setPredictedColleges([]);
        setFilteredColleges([]);
        setHasSearched(false);

        if (data.data.length === 0)
        {
            showNotificationMessage(`No data available for ${counsellingType} round ${round}`, true); 
        }
        else
        {
            const isAdmin = localStorage.getItem('role') === 'admin';
            if (isAdmin) {
              showNotificationMessage("College data loaded successfully");
            }
        }
      } catch (error) {
        showNotificationMessage(error.message, true);
        console.error("Data loading error:", error);
      } finally {
        setIsLoading(false);
      }
      
    };
    loadData();
  }, [counsellingType, round]);

  // Pagination and display logic
  useEffect(() => {
    const updateDisplay = () => {
      if (filteredColleges.length === 0) {
        setDisplayedColleges([]);
        return;
      }

      const indexOfLastCollege = currentPage * collegesPerPage;
      const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
      setDisplayedColleges(
        showAll 
          ? filteredColleges 
          : filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege)
      );
    };
    updateDisplay();
  }, [filteredColleges, currentPage, showAll]);

  // Filter functions
  const clearFilters = () => {
    setSearchTerm("");
    setProgramFilter("");
    setCurrentPage(1);
    setShowAll(false);
    setFilteredColleges(predictedColleges);
    showNotificationMessage(`Showing all ${predictedColleges.length} colleges`);
  };

  const applyFilters = () => {
    if (!predictedColleges.length) return;

    let results = [...predictedColleges];

    if (searchTerm) {
      results = results.filter(college => 
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (programFilter) {
      results = results.filter(college => 
        college.branch.toLowerCase().includes(programFilter.toLowerCase())
      );
    }

    setFilteredColleges(results);
    setCurrentPage(1);
    setShowAll(false);

    if (results.length === 0) {
      showNotificationMessage("No colleges match your filters. Try different search terms.", true);
    } else {
      showNotificationMessage(`Found ${results.length} colleges matching your filters`);
    }
  };

  const clearAllHistory = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear all prediction history?")) {
      const cleared = await clearToolHistory(TOOL_NAME);
      if (cleared) {
        setHistory([]);
        showNotificationMessage("History cleared successfully");
      } else {
        showNotificationMessage("Failed to clear history", true);
      }
    }
  }, [showNotificationMessage]);

  const deleteHistoryItem = useCallback(async (index) => {
    if (window.confirm("Delete this prediction from history?")) {
      const deleted = await deleteHistoryItemUtil(TOOL_NAME, index);
      if (deleted) {
        setHistory(prev => {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        });
        showNotificationMessage("Prediction removed from history");
      } else {
        showNotificationMessage("Failed to delete prediction", true);
      }
    }
  }, [showNotificationMessage]);

  const reusePrediction = (item) => {
    setRank(item.rank);
    setSeatType(item.seatType);
    setGender(item.gender);
    setQuota(item.quota);
    setRound(item.round || 1);
    setCounsellingType(item.counsellingType || "CSAB");
    showNotificationMessage("Prediction criteria loaded");
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Pagination controls
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredColleges.length / collegesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Main prediction function
  const predictColleges = () => {
    setHasSearched(true);
    if (!rank) {
      showNotificationMessage("Please enter your rank", true);
      return;
    }

    const numericRank = Number(rank);
    if (isNaN(numericRank)) {
      showNotificationMessage("Please enter a valid rank number", true);
      return;
    }

    try {
      let results = collegeData.data
        .filter(college => {
          return (
            college["Seat Type"] === seatType &&
            college.Quota === quota &&
            college.Gender === gender &&
            (numericRank >= college["Opening Rank"] && 
            numericRank <= college["Closing Rank"])
          );
        })
        .map(college => ({
          name: college.Institute,
          branch: college["Academic Program Name"],
          quota: college.Quota,
          seatType: college["Seat Type"],
          gender: college.Gender,
          openingRank: college["Opening Rank"],
          closingRank: college["Closing Rank"],
          round: college.Round,
          chance: calculateChance(numericRank, college["Opening Rank"], college["Closing Rank"])
        }))
        .sort((a, b) => a.openingRank - b.openingRank);
    
      setPredictedColleges(results);
      setFilteredColleges(results);
      setCurrentPage(1);
      setShowAll(false);
      setSearchTerm("");
      setProgramFilter("");
      
      const calculation = {
        rank,
        seatType,
        gender,
        quota,
        round,
        counsellingType,
        predictedCount: results.length,
        timestamp: new Date().toISOString()
      };

      const saved = saveCalculation(TOOL_NAME, calculation, true);
      if (saved) {
        setHistory(prev => {
          const exists = prev.find(item => 
            item.rank === calculation.rank && 
            item.seatType === calculation.seatType &&
            item.gender === calculation.gender &&
            item.quota === calculation.quota
          );
          return exists ? prev : [calculation, ...prev].slice(0, 5);
        });
      }
    
      if (results.length === 0) {
        showNotificationMessage("No colleges found for your rank and criteria. Try adjusting your filters.", true);
      } else {
        showNotificationMessage(`Found ${results.length} colleges matching your criteria`);
      }
    } catch (error) {
      showNotificationMessage("Error processing college data. Please try again.", true);
      console.error('Prediction error:', error);
    }
  };

  const calculateChance = (rank, openingRank, closingRank) => {
    const position = (rank - openingRank) / (closingRank - openingRank);
    if (position < 0.3) return "High (>95%)";
    if (position < 0.7) return "Medium (70-90%)";
    return "Low (<70%)";
  };

  // Utility functions
  const copyResults = () => {
    const text = filteredColleges.map(college => 
      `${college.name} - ${college.branch} (${college.chance})`
    ).join("\n");
    navigator.clipboard.writeText(`College Predictions for Rank ${rank}:\n${text}`);
    showNotificationMessage("Results copied to clipboard");
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showNotificationMessage("Please enter email", true);
      return;
    }
  
    setIsSending(true);
    showNotificationMessage("Generating and sending report...");
  
    try {
      const pdfBuffer = await generatePDFBuffer({
        colleges: filteredColleges,
        rank,
        seatType,
        gender,
        quota,
        round,
        counsellingType
      });
  
      const formData = new FormData();
      formData.append('pdf', new Blob([pdfBuffer], { type: 'application/pdf' }), `${counsellingType}-predictions-${rank}.pdf`);
      formData.append('email', email);
      formData.append('rank', rank);
      formData.append('seatType', seatType);
       formData.append('category', seatType); 
      formData.append('name', localStorage.getItem('username') || '');
      formData.append('counsellingType', counsellingType);
      formData.append('round', round);
  
      const apiUrl = import.meta.env.VITE_API_URL_EMAIL;
      const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
      const endpoint = isTestMode 
        ? `${apiUrl}/api/v1/email/send-test-email` 
        : `${apiUrl}/api/v1/email/send-with-pdf`;
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: isTestMode ? JSON.stringify({ email }) : formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      
      if (isTestMode) {
        showNotificationMessage(
          result.testPreviewUrl
            ? `Test email sent! Preview at ${result.testPreviewUrl}`
            : "Test email sent successfully"
        );
      } else {
        showNotificationMessage(
          result.previewUrl
            ? `Email sent! Preview available at ${result.previewUrl}`
            : "Email sent successfully! Check your inbox"
        );
      }
      
      setEmail("");
    } catch (error) {
      console.error("Email sending error:", error);
      showNotificationMessage(getErrorMessage(error), true);
    } finally {
      setIsSending(false);
    }
  };
  
  function getErrorMessage(error) {
    if (error.message.includes("Failed to fetch")) {
      return "Network error - please check your connection";
    }
    if (error.message.includes("Network Error")) {
      return "Cannot connect to server - check your internet";
    }
    if (error.message.includes("401")) {
      return "Session expired - please login again";
    }
    return error.message || "Failed to send email";
  }

  const toggleShowAll = () => {
    setShowAll(!showAll);
    setCurrentPage(1);
  };

  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  darkMode 
}) => {
  // Show max 5 page buttons at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`p-1 md:p-2 rounded-md ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="First page"
      >
        <ChevronDoubleLeftIcon className="h-4 w-4" />
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1 md:p-2 rounded-md ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {/* Page Number Buttons */}
      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`md:px-3 px-2 py-1 rounded-md w-[30px] md:min-w-[40px] ${
            currentPage === page
              ? 'bg-orange-600 text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1 md:p-2 rounded-md ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`p-1 md:p-2 rounded-md ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="Last page"
      >
        <ChevronDoubleRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

  const showResultsSection = hasSearched && predictedColleges.length > 0;
  const showNoResultsMessage = hasSearched && predictedColleges.length === 0;
  const showNoFilterResults = filteredColleges.length === 0 && predictedColleges.length > 0;
  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {showNotification && (
        <Notification 
          message={notification.message} 
          isError={notification.isError} 
          onClose={closeNotification} 
        />
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => window.history.back()}
                className={`flex items-center gap-1 p-1.5 sm:p-2 rounded-md ${
                  darkMode 
                    ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                    : 'text-blue-600 hover:bg-gray-100 hover:text-blue-700'
                } transition-colors`}
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </button>
            </div>

            <div className="flex-1 flex justify-center px-2">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
                {counsellingType} College Predictor
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'} shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                Find Your Perfect Engineering College
              </h2>
              <p className={`mb-4 text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Predict which colleges you can get based on your JEE Main rank in {counsellingType}. Our algorithm analyzes previous year cutoff data to give you accurate predictions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  <InformationCircleIcon className="h-4 w-4 inline mr-1" />
                  Updated with 2024 Cutoffs
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-gray-700 text-orange-300' : 'bg-orange-100 text-orange-800'
                }`}>
                  <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                  500+ Colleges
                </span>
                <button 
                  onClick={toggleInfoPanel}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-purple-300' : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  <InformationCircleIcon className="h-4 w-4 inline mr-1" />
                  How It Works
                </button>
              </div>
            </div>
            <div className="hidden md:block flex-1">
              <img 
                src={CollegeIllustration} 
                alt="College illustration" 
                className="w-full h-auto max-w-md mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfoPanel && (
          <div className={`mb-8 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base md:text-xl font-bold flex items-center gap-2">
                <InformationCircleIcon className="h-6 w-6 text-blue-500" />
                About {counsellingType} College Predictor
              </h3>
              <button 
                onClick={toggleInfoPanel}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <XMarkIcon className="md:h-5 md:w-5 h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2 md:text-lg text-sm">Data Sources</h4>
                <p className={`mb-3 md:text-base text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Our predictions are based on official data from:
                </p>
                <ul className={`space-y-2 md:text-base text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  <li className="flex items-center gap-2">
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <a href="https://csab.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                      CSAB Official Website
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                      JoSAA Official Website
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <a href="https://jeemain.nta.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                      JEE Main NTA Portal
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2 md:text-lg text-sm">How It Works</h4>
                <ol className={`space-y-3 md:text-base text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>1.</span>
                    Enter your JEE Main rank and seat type
                  </li>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>2.</span>
                    Select your preferred quota, gender and round
                  </li>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>3.</span>
                    Get personalized college predictions for {counsellingType}
                  </li>
                </ol>
              </div>
            </div>

            {/* Warning Section */}
            <div className={`mt-6 md:p-4 p-2 md:text-base text-sm rounded-lg ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-100 border-yellow-300'} border`}>
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className={`h-5 w-5 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Important Notice</h4>
                  <p className={`md:text-sm text-xs ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                    These predictions are based on previous year's {counsellingType} cutoff trends and may vary. 
                    Actual cutoffs depend on various factors including number of applicants, seat availability, 
                    and reservation policies. Use this as a reference only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Counselling Type Tabs */}
        <div className={`mb-6 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div className="flex">
            <button
              onClick={() => {
                setCounsellingType("CSAB");
                setRound(1);
              }}
              className={`flex-1 py-3 px-4 md:text-base text-sm font-medium text-center transition-colors ${
                counsellingType === "CSAB"
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              CSAB Predictor
            </button>
            <button
              onClick={() => {
                setCounsellingType("JoSAA");
                setRound(1);
              }}
              className={`flex-1 py-3 md:text-base text-sm px-4 font-medium text-center transition-colors ${
                counsellingType === "JoSAA"
                  ? darkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-500 text-white"
                  : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              JoSAA Predictor
            </button>
          </div>
        </div>

        {/* Prediction Form Section */}
        <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`} ref={formRef}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="md:text-xl text-lg font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              Enter Your Details
            </h3>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm">
                <ArrowPathIcon className="md:h-4 md:w-4 h-2 w-2 animate-spin" />
                Loading data...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:text-base text-xs">
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Rank</label>
                <input
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  placeholder={counsellingType === "CSAB" ? "Enter your JEE Main CRL Rank" : "Enter your JEE Main rank"}
                />
              </div>
              
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Seat Type</label>
                <select
                  value={seatType}
                  onChange={(e) => setSeatType(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="EWS">EWS</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Gender-Neutral">Gender-Neutral</option>
                  <option value="Female-only (including Supernumerary)">Female-only</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quota</label>
                <select
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="HS">Home State (HS)</option>
                  <option value="OS">Other State (OS)</option>
                  <option value="AI">All India (AI)</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Round</label>
                <select
                  value={round}
                  onChange={(e) => setRound(Number(e.target.value))}
                  className={`w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="1">Round 1</option>
                  <option value="2">Round 2</option>
                  {counsellingType === "JoSAA" && (
                    <>
                      <option value="3">Round 3</option>
                      <option value="4">Round 4</option>
                      <option value="5">Round 5</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Warning for CSAB */}
            {counsellingType === "CSAB" && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-100 border-blue-300'} border`}>
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className={`h-5 w-5 flex-shrink-0 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                  <p className={`md:text-sm text-xs ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    CSAB typically has two rounds as compared to JoSAA and it takes your CRL Rank. Make sure to select the appropriate round and enter your CRL Rank for accurate predictions.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={predictColleges}
              disabled={!rank || collegeData.length === 0}
              className={`w-full bg-gradient-to-r md:text-base text-sm from-orange-600 to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all ${
                !rank || collegeData.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-500 hover:to-orange-400 shadow-md hover:shadow-lg'
              } flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Loading Data...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Predict Colleges
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResultsSection && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <h3 className={`md:text-xl text-base font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Predicted Colleges ({filteredColleges.length} of {predictedColleges.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copyResults}
                  className={`py-2 px-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Results
                </button>
                
                <PDFDownloadLink
                  document={<CollegeReportPDF data={{ 
                    rank, 
                    seatType, 
                    gender, 
                    quota,
                    round,
                    counsellingType,
                    colleges: filteredColleges 
                  }} />}
                  fileName={`${counsellingType.toLowerCase()}-predictions-${rank}.pdf`}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2 px-4 rounded-lg md:text-sm text-xs font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {({ loading }) => loading ? (
                    <>
                      <ArrowPathIcon className="md:h-4 md:w-4 h-3 w-3 animate-spin" />
                      Preparing PDF...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* College Name Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  className={`block w-full pl-10 pr-10 py-2 md:text-base text-sm rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  placeholder="Search by institute name"
                />
                {searchTerm ? (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={applyFilters}
                      className={`p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      <MagnifyingGlassIcon className="md:h-5 md:w-5 h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={applyFilters}
                    className={`absolute inset-y-0 right-0 p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <MagnifyingGlassIcon className="md:h-5 md:w-5 h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Program Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  className={`block w-full pl-10 pr-10 py-2 md:text-base text-sm rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  placeholder="Filter by program name"
                />
                {programFilter ? (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={applyFilters}
                      className={`p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      <MagnifyingGlassIcon className="md:h-5 md:w-5 h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={applyFilters}
                    className={`absolute inset-y-0 right-0 p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <MagnifyingGlassIcon className="md:h-5 md:w-5 h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                disabled={!searchTerm && !programFilter}
                className={`py-2 px-4 rounded-lg md:text-base text-sm flex items-center justify-center gap-2 transition-colors ${
                  !searchTerm && !programFilter ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <XMarkIcon className="md:h-5 md:w-5 h-4 w-4" />
                Clear Filters
              </button>
            </div>

            <div className="space-y-4 md:text-base text-sm">
              {showNoFilterResults ? (
                <div className={`p-8 rounded-lg text-center ${
                  darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                }`}>
                  <div className={`flex flex-col items-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <img src={EmptyStateIllustration} alt="No results" className="md:h-56 h-44" />
                    {/* <h4 className="text-lg font-medium">No colleges match your filters</h4> */}
                    <p className="mt-1">Try different search terms or clear filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {displayedColleges.map((college, index) => (
                    <div 
                      key={index} 
                      className={`p-4 md:text-base text-sm rounded-lg border-l-4 border-orange-500 hover:shadow-md transition-all ${
                        darkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-700/70' 
                          : 'bg-white hover:bg-gray-50 border-l-4 border-orange-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {college.name}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {college.branch}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`px-3 py-1 rounded text-xs font-medium mb-1 ${
                                college.chance.includes("High") ? "bg-green-900/30 text-green-300 border border-green-500" :
                                college.chance.includes("Medium") ? "bg-yellow-900/30 text-yellow-300 border border-yellow-500" :
                                "bg-red-900/30 text-red-300 border border-red-500"
                              }`}>
                                {college.chance}
                              </span>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Round {college.round}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`md:p-3 p-2 rounded-lg border  ${
                              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
                            }`}>
                              <h5 className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } mb-1`}>RANK RANGE</h5>
                              <p className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {college.openingRank} - {college.closingRank}
                              </p>
                            </div>
                            <div className={`md:p-3 p-2 rounded-lg border ${
                              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
                            }`}>
                              <h5 className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } mb-1`}>QUOTA</h5>
                              <p className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {college.quota === 'HS' ? 'Home State' : 
                                 college.quota === 'OS' ? 'Other State' : 'All India'}
                              </p>
                            </div>
                            <div className={`md;p-3 p-2 rounded-lg border ${
                              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
                            }`}>
                              <h5 className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } mb-1`}>SEAT TYPE</h5>
                              <p className={`md:text-sm text-xs font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {college.seatType}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

{!showAll && filteredColleges.length > collegesPerPage && (
  <div className="flex flex-col items-center gap-4">
    <div className="text-sm mb-1 text-gray-500 dark:text-gray-400">
      Page {currentPage} of {Math.ceil(filteredColleges.length / collegesPerPage)}
    </div>
    
    <PaginationControls
      currentPage={currentPage}
      totalPages={Math.ceil(filteredColleges.length / collegesPerPage)}
      onPageChange={paginate}
      darkMode={darkMode}
    />
    
    <button
      onClick={toggleShowAll}
      className={`flex items-center justify-center py-2 px-4 rounded-lg transition-colors ${
        darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
    >
      <ChevronDownIcon className="w-5 h-5 mr-1" />
      Show All ({filteredColleges.length} colleges)
    </button>
  </div>
)}

{showAll && filteredColleges.length > collegesPerPage && (
  <button
    onClick={toggleShowAll}
    className={`flex items-center justify-center w-full py-2 rounded-lg transition-colors ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
  >
    <ChevronUpIcon className="w-5 h-5 mr-1" />
    Show Less
  </button>
)}
                </>
              )}
            </div>

            {!showNoFilterResults && (
              <form 
                onSubmit={sendEmail} 
                className={`md:p-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
              >
                <h4 className={`flex items-center md:text-lg text-base font-medium mb-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <EnvelopeIcon className="md:w-6 w-5 h-5 md:h-6 mr-2 text-blue-500" />
                  Email Results (PDF + Details)
                </h4>
                <div className="flex flex-col sm:flex-row gap-3 md:text-base text-sm">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full rounded-lg md:px-4 px-3 py-2 md:py-3 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="bg-gradient-to-r md:text-base text-sm from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium md:py-3 py-2 px-4 md:px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px] shadow-md hover:shadow-lg"
                  >
                    {isSending ? (
                      <>
                        <ArrowPathIcon className="md:h-5 h-4 w-4 md:w-5 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : 'Send Email'}
                  </button>
                </div>
                <p className={`mt-2 md:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  We'll send a detailed PDF report to your email
                </p>
              </form>
            )}
          </div>
        )}

        {showNoResultsMessage && (
          <div className={`md:mt-6 mt-4 p-6 md:p-8 rounded-xl md:text-base text-sm text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <img src={EmptyStateIllustration} alt="No results" className="md:h-56 h-44" />
              {/* <h4 className="md:text-xl text-base font-medium mb-2">No colleges found for your criteria</h4> */}
              <p className="mb-4 md:text-base text-sm">Try adjusting your rank or filters</p>
              <button
                onClick={() => {
                  setRank("");
                  setHasSearched(false);
                  formRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r md:text-sm text-xs from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h4 className="md:text-2xl text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Prediction History
              </h4>
              <button
                onClick={clearAllHistory}
                className={`md:px-4 px-1 py-2 md:text-sm text-xs rounded-lg transition-colors flex items-center md:gap-2 gap:2 ${
                  darkMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-400 hover:bg-red-500 text-white'
                }`}
              >
                <XMarkIcon className="h-4 w-4" />
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative group md:p-5 p-1 rounded-xl border shadow-lg transition-all ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500' 
                      : 'bg-white border-gray-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`font-bold md:text-lg text-sm ${
                        darkMode ? 'text-purple-300' : 'text-purple-600'
                      }`}>Rank {item.rank}</span>
                      <span className={`ml-2 px-2 py-1 md:text-sm text-xs rounded-full ${
                        darkMode ? 'bg-gray-700 text-blue-300' : 'bg-gray-200 text-blue-600'
                      }`}>
                        {item.seatType}
                      </span>
                      <div className={`mt-2 md:text-sm text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span className={`font-bold ${
                          darkMode ? 'text-orange-400' : 'text-orange-500'
                        }`}>{item.predictedCount}</span> colleges predicted
                      </div>
                      <div className={`mt-1 md:text-sm text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.counsellingType} - Round {item.round || 1}
                      </div>
                    </div>
                    <div className={`md:text-sm text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteHistoryItem(index)}
                    className="absolute md:top-2 top-5 right-3 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                    title="Delete"
                  >
                    ×
                  </button>
                  
                  <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end gap-2">
                    <button 
                      className={`md:text-sm text-xs px-3 py-1 rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => reusePrediction(item)}
                    >
                      Use Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} mt-12`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h4 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                {counsellingType} College Predictor
              </h4>
              <h1 className="md:-mt-2 mb-2 md:text-sm text-xs dark:text-white/90 text-black/90">Powered by CollegeSecracy</h1>
              <p className="text-sm">
                © {new Date().getFullYear()} All rights reserved. Data sourced from official portals.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-4 mb-4">
                <a href="https://csab.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  CSAB
                </a>
                <a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  JoSAA
                </a>
                <a href="https://jeemain.nta.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  JEE Main
                </a>
              </div>
              <div className={`text-xs p-2 rounded-lg ${
                darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                Disclaimer: Predictions are based on historical data and may vary, Take it as a reference.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollegePredictor;