import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FixedSizeList as List } from 'react-window';
import { debounce } from 'lodash';
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
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BookOpenIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
    ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/outline";

import { fetchCollegeData } from "../../utils/parseCollegeData";

// SVG Illustrations
import CollegeIllustration from "../../assets/CollegeIllustration.webp";
import EmptyStateIllustration from "../../assets/EmptyStateIllustration.webp";
import UPTACLogo from "../../assets/uptac-logo.webp";

// Constants
const TOOL_NAME = 'state-college-predictor';
const COLLEGES_PER_PAGE = 5;
const DEBOUNCE_DELAY = 300;
const CARD_HEIGHT = 220; 

const Notification = React.memo(({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      message ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`p-4 rounded-lg shadow-lg ${
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
});

const CollegeCard = React.memo(({ college, darkMode }) => (
  <div className={`p-4 rounded-lg border-l-4 border-orange-500 hover:shadow-md transition-all mb-4 ${
    darkMode 
      ? 'bg-gray-700/50 hover:bg-gray-700/70' 
      : 'bg-white hover:bg-gray-50 border-l-4 border-orange-500'
  }`}>
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h4 className={`md:font-bold font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {college.name}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {college.branch}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium mb-1 ${
              college.chance.includes("High") 
                ? "bg-green-900/20 text-green-500 border border-green-500" :
              college.chance.includes("Medium") 
                ? "bg-yellow-900/20 text-yellow-500 border border-yellow-500" :
                "bg-red-900/20 text-red-500 border border-red-500"
            }`}>
              {college.chance}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Chance of Admission
            </span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            <h5 className={`text-xs font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } mb-1`}>RANK RANGE</h5>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {college.openingRank} - {college.closingRank}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            <h5 className={`text-xs font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } mb-1`}>QUOTA</h5>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {college.quota === 'HS' ? 'Home State' : 
               college.quota === 'OS' ? 'Other State' : 'All India'}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            <h5 className={`text-xs font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } mb-1`}>SEAT TYPE</h5>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {college.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StateCollegePredictor = () => {
  const [rank, setRank] = useState("");
  const [state, setState] = useState("Uttar Pradesh");
  const [category, setCategory] = useState("OPEN");
  const [gender, setGender] = useState("Gender Neutral");
  const [quota, setQuota] = useState("HS");
  const [round, setRound] = useState("1");
  const [collegeData, setCollegeData] = useState([]);
  const [predictedColleges, setPredictedColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [history, setHistory] = useState([]);
  const [email, setEmail] = useState("");
  const counsellingType = "UPTAC"
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
  const [activeTab, setActiveTab] = useState("stateColleges");
  const [uptacInfo, setUptacInfo] = useState({
    registrationStart: "Registration yet not started",
    registrationEnd: "Registration yet not started",
    choiceFilling: "Not Started",
    firstRoundSeatAllotment: "Not Started",
    reportingCenters: ["Your respective Alloted college"]
  });
  const formRef = useRef(null);
    const collegesPerPage = 5;
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  }, [darkMode]);

  const showNotificationMessage = useCallback((message, isError = false) => {
    setNotification({ message, isError });
    setShowNotification(true);
  }, []);

  const closeNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

// In your useEffect for loadData:
useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [data, savedHistory] = await Promise.all([
        fetchCollegeData(counsellingType, round, 2024),
        getCalculations(TOOL_NAME)
      ]);
      
      // Store the entire response data, not just data.data
      setCollegeData(data); 
      setHistory(savedHistory || []);
    } catch (error) {
      showNotificationMessage(error.message, true);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [counsellingType, round, showNotificationMessage]);

  const filteredCollegesMemo = useMemo(() => {
    if (!predictedColleges.length) return [];
    
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
    return results;
  }, [predictedColleges, searchTerm, programFilter]);

  const displayedCollegesMemo = useMemo(() => {
    if (filteredCollegesMemo.length === 0) return [];
    if (showAll) return filteredCollegesMemo;
    
    const indexOfLastCollege = currentPage * COLLEGES_PER_PAGE;
    const indexOfFirstCollege = indexOfLastCollege - COLLEGES_PER_PAGE;
    return filteredCollegesMemo.slice(indexOfFirstCollege, indexOfLastCollege);
  }, [filteredCollegesMemo, currentPage, showAll]);

  const debouncedApplyFilters = useCallback(
    debounce(() => {
      setFilteredColleges(filteredCollegesMemo);
      setCurrentPage(1);
      setShowAll(false);

      if (filteredCollegesMemo.length === 0) {
        showNotificationMessage("No colleges match your filters. Try different search terms.", true);
      } else {
        showNotificationMessage(`Found ${filteredCollegesMemo.length} colleges matching your filters`);
      }
    }, DEBOUNCE_DELAY),
    [filteredCollegesMemo, showNotificationMessage]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setProgramFilter("");
    setCurrentPage(1);
    setShowAll(false);
    setFilteredColleges(predictedColleges);
    showNotificationMessage(`Showing all ${predictedColleges.length} colleges`);
  }, [predictedColleges, showNotificationMessage]);

  const applyFilters = useCallback(() => {
    debouncedApplyFilters();
  }, [debouncedApplyFilters]);

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

  const reusePrediction = useCallback((item) => {
    setRank(item.rank);
    setRound(item.round);
    setState(item.state);
    setCategory(item.category);
    setGender(item.gender);
    setQuota(item.quota);
    showNotificationMessage("Prediction criteria loaded");
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [showNotificationMessage]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < Math.ceil(filteredColleges.length / COLLEGES_PER_PAGE)) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, filteredColleges.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

// Update your predictColleges function:
const predictColleges = useCallback(() => {
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
    // Access the college data array correctly
    const collegeArray = collegeData.data || [];
    
    const results = collegeArray
      .filter(college => {
        const matchesQuota = college.Quota?.trim().toUpperCase() === quota.trim().toUpperCase();
        const matchesState = college.State?.trim().toLowerCase() === state.trim().toLowerCase();
        const matchesCategory = college.Category?.trim().toUpperCase() === category.trim().toUpperCase();
        const matchesGender = (college['Seat Gender'] || college.Gender)?.trim().toLowerCase() === gender.trim().toLowerCase();
        const matchesRank = numericRank >= college['Opening Rank'] && numericRank <= college['Closing Rank'];

        return matchesState && matchesCategory && matchesQuota && matchesGender && matchesRank;
      })
      .map(college => ({
        state: college.State,
        round: college.Round,
        name: college.Institute,
        branch: college['Academic Program Name'] || college.Program,
        quota: college.Quota,
        category: college.Category,
        gender: college['Seat Gender'] || college.Gender,
        openingRank: college['Opening Rank'],
        closingRank: college['Closing Rank'],
        chance: calculateChance(numericRank, college['Opening Rank'], college['Closing Rank'])
      }))
      .sort((a, b) => a.openingRank - b.openingRank);
  
      setPredictedColleges(results);
      setFilteredColleges(results);
      setCurrentPage(1);
      setShowAll(false);
      setSearchTerm("");
      setProgramFilter("");
      
      const calculation = {
        state,
        round,
        rank,
        category,
        gender,
        quota,
        predictedCount: results.length,
        timestamp: new Date().toISOString()
      };

      const saved = saveCalculation(TOOL_NAME, calculation, true);
      if (saved) {
        setHistory(prev => {
          const exists = prev.find(item => 
            item.rank === calculation.rank && 
            item.round === calculation.round &&
            item.state === calculation.state && 
            item.category === calculation.category &&
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
    }
  }, [rank, state, category, gender, quota, collegeData, showNotificationMessage]);

  const calculateChance = useCallback((rank, openingRank, closingRank) => {
    const position = (rank - openingRank) / (closingRank - openingRank);
    if (position < 0.3) return "High (>95%)";
    if (position < 0.7) return "Medium (70-90%)";
    return "Low (<70%)";
  }, []);

  const copyResults = useCallback(() => {
    const text = filteredColleges.map(college => 
      `${college.name} - ${college.branch} (${college.chance})`
    ).join("\n");
    navigator.clipboard.writeText(`College Predictions for Rank ${rank}:\n${text}`);
    showNotificationMessage("Results copied to clipboard");
  }, [filteredColleges, rank, showNotificationMessage]);

  const sendEmail = useCallback(async (e) => {
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
        state,
        round,
        rank,
        category,
        gender,
        quota,
        counsellingType
      });
  
      const formData = new FormData();
      formData.append('pdf', new Blob([pdfBuffer], { type: 'application/pdf' }), `college-report-${rank}.pdf`);
      formData.append('email', email);
      formData.append('round', round);
      formData.append('rank', rank);
      formData.append('category', category);
      formData.append('seatType', category);
      formData.append('counsellingType', counsellingType);
      // To do it later using real data
      //formData.append('name', localStorage.getItem('username') || '');
  
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
      showNotificationMessage(getErrorMessage(error), true);
    } finally {
      setIsSending(false);
    }
  }, [email, filteredColleges, state, rank, category, gender, quota, showNotificationMessage, calculateChance]);

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

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
    setCurrentPage(1);
  }, []);

  const toggleInfoPanel = useCallback(() => {
    setShowInfoPanel(prev => !prev);
  }, []);

  const CollegeListRow = useCallback(({ index, style }) => (
    <div style={style}>
      <CollegeCard 
        college={displayedCollegesMemo[index]} 
        darkMode={darkMode}
      />
    </div>
  ), [displayedCollegesMemo, darkMode]);

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

  const UPTACCounselingInfo = useCallback(() => (
    <div className={`md:p-6 p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
      <div className="flex items-center gap-4 mb-6">
        <img src={UPTACLogo} alt="UPTAC Logo" className="md:h-12 h-10 w-10 md:w-12" />
        <div>
          <h3 className="md:text-xl text-base font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            UPTAC Counseling Information
          </h3>
          <p className={`md:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Uttar Pradesh Technical Admission Counseling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold mb-3 md:text-base text-sm flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
            Important Dates
          </h4>
          <ul className={`space-y-3 md:text-base text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex justify-between">
              <span>Registration Start:</span>
              <span className="font-medium">{uptacInfo.registrationStart}</span>
            </li>
            <li className="flex justify-between">
              <span>Registration End:</span>
              <span className="font-medium">{uptacInfo.registrationEnd}</span>
            </li>
            <li className="flex justify-between">
              <span>Choice Filling:</span>
              <span className="font-medium">{uptacInfo.choiceFilling}</span>
            </li>
            <li className="flex justify-between">
              <span>First Round Seat Allotment:</span>
              <span className="font-medium">{uptacInfo.firstRoundSeatAllotment}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 md:text-base text-sm flex items-center gap-2">
            <BuildingLibraryIcon className="h-5 w-5 text-blue-500" />
            Reporting Centers
          </h4>
          <ul className={`space-y-2 md:text-base text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {uptacInfo.reportingCenters.map((center, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className={`md:w-5 w-4 h-4 md:h-5 rounded-full flex items-center justify-center text-xs ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </span>
                {center}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <a 
              href="https://uptac.admissions.nic.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 md:px-4 px-3 py-1 md:text-base text-sm md:py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              } transition-colors`}
            >
              <ArrowUpRightIcon className="h-4 w-4" />
              Visit UPTAC Official Website
            </a>
          </div>
        </div>
      </div>
    </div>
  ), [darkMode, uptacInfo]);

  const StateCollegesInfo = useCallback(() => (
    <div className={`md:p-6 p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
      <div className="flex items-center gap-4 mb-6">
        <BuildingLibraryIcon className="h-10 w-10 text-orange-500" />
        <div>
          <h3 className="md:text-xl text-base font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Top State Engineering Colleges
          </h3>
          <p className={`md:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Premier institutes under AKTU, Lucknow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Harcourt Butler Technical University", location: "Kanpur", established: 1921 },
          { name: "Madan Mohan Malaviya University of Technology", location: "Gorakhpur", established: 1962 },
          { name: "Kamla Nehru Institute of Technology", location: "Sultanpur", established: 1976 },
          { name: "Institute of Engineering and Technology", location: "Lucknow", established: 1984 },
          { name: "Dr. A.P.J. Abdul Kalam Technical University", location: "Lucknow", established: 2000 },
          { name: "Government Engineering College", location: "Jhansi", established: 2007 }
        ].map((college, index) => (
          <div 
            key={index} 
            className={`md:p-4 p-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600 hover:border-orange-500' 
                : 'bg-white border-gray-200 hover:border-orange-400'
            } transition-colors`}
          >
            <h4 className={`font-bold md:text-base text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {college.name}
            </h4>
            <div className={`md:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {college.location}
              </p>
              <p className="flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Est. {college.established}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {showNotification && (
        <Notification 
          message={notification.message} 
          isError={notification.isError} 
          onClose={closeNotification} 
        />
      )}

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
                College Predictor
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'} shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-lg md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                Find Your Perfect Engineering College
              </h2>
              <p className={`mb-4 md:text-base text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Predict which colleges you can get based on your JEE Main rank. Our algorithm analyzes previous year cutoff data to give you accurate predictions.
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
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {showInfoPanel && (
          <div className={`mb-8 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm md:text-xl font-bold flex items-center gap-2">
                <InformationCircleIcon className="md:h-6 h-4 w-4 md:w-6 text-blue-500" />
                About College Predictor
              </h3>
              <button 
                onClick={toggleInfoPanel}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <XMarkIcon className="md:h-5 h-4 w-4  md:w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2 text-sm md:text-lg">Data Sources</h4>
                <p className={`mb-3 md:text-base text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Our predictions are based on official data from:
                </p>
                <ul className={`space-y-2 md:text-base text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  <li className="flex items-center gap-2">
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                      JoSAA Official Website
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <a href="https://csab.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                      CSAB Official Website
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
                <h4 className="font-bold mb-2 text-sm md:text-lg">How It Works</h4>
                <ol className={`space-y-3 md:text-base text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>1.</span>
                    Enter your JEE Main rank and category
                  </li>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>2.</span>
                    Select your preferred quota and gender
                  </li>
                  <li className="flex gap-2">
                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>3.</span>
                    Get personalized college predictions
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className={`mb-6 rounded-lg p-1 md:text-base text-xs ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex">
            <button
              onClick={() => setActiveTab("stateColleges")}
              className={`flex-1 py-2 px-4  rounded-md text-center font-medium transition-colors ${
                activeTab === "stateColleges"
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900 shadow"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BuildingLibraryIcon className="md:h-5 h-4 w-4 md:w-5 inline mr-2" />
              State Colleges
            </button>
            <button
              onClick={() => setActiveTab("uptacInfo")}
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition-colors ${
                activeTab === "uptacInfo"
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900 shadow"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              UPTAC Counseling
            </button>
            <button
              onClick={() => setActiveTab("predictor")}
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition-colors ${
                activeTab === "predictor"
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900 shadow"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChartBarIcon className="h-5 w-5 inline mr-2" />
              College Predictor
            </button>
          </div>
        </div>

        {activeTab === "stateColleges" && <StateCollegesInfo />}
        {activeTab === "uptacInfo" && <UPTACCounselingInfo />}

        {activeTab === "predictor" && (
          <>
            <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`} ref={formRef}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base md:text-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                  Enter Your Details
                </h3>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Loading data...
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Rank</label>
                    <input
                      type="number"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className={`w-full rounded-lg md:px-4 px-3 text-sm md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter your JEE Main rank"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2  text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={`w-full rounded-lg  md:px-4 px-3 text-sm md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Maharastra">Maharastra</option>
                      <option value="Punjab">Punjab</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block mb-2  text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full rounded-lg  md:px-4 px-3 text-xs md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                    {/* <!-- OPEN Category --> */}
                    <option value="OPEN">OPEN</option>
                    <option value="OBC">OBC</option>
            <option value="EWS">EWS</option>
<option value="SC">SC</option>
<option value="ST">ST</option>
<option value="OPEN(AF)">OPEN(AF)</option>
<option value="OPEN(TF)">OPEN(TF)</option>
<option value="OPEN(PH)">OPEN(PH)</option>

 {/* OBC Category */}
<option value="OBC(AF)">OBC(AF)</option>
<option value="OBC(TF)">OBC(TF)</option>
<option value="OBC(PH)">OBC(PH)</option>

{/* EWS Category */}
<option value="EWS(AF)">EWS(AF)</option>
<option value="EWS(TF)">EWS(TF)</option>
<option value="EWS(PH)">EWS(PH)</option>

{/* <!-- SC Category --> */}
<option value="SC(AF)">SC(AF)</option>
<option value="SC(TF)">SC(TF)</option>
<option value="SC(PH)">SC(PH)</option>

 {/* ST Category */}
<option value="ST(AF)">ST(AF)</option>
<option value="ST(TF)">ST(TF)</option>
<option value="ST(PH)">ST(PH)</option>


                    </select>
                  </div>

                  <div>
                    <label className={`block mb-2  text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full rounded-lg  md:px-4 px-3 text-sm md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Gender Neutral">Gender-Neutral</option>
                      <option value="Female Only">Female-only (including Supernumerary)</option>
                    </select>
                  </div>

                  
                  <div>
                    <label className={`block mb-2  text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Round</label>
                    <select
                        value={round}
                        onChange={(e) => {
                        setRound(e.target.value);
                        // This will trigger the useEffect to reload data
                        }}
                      className={`w-full rounded-lg  md:px-4 px-3 text-sm md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="1">Round 1</option>
                      <option value="2">Round 2</option>
                      <option value="3">Round 3</option>
                      <option value="4">Round 4</option>
                      <option value="AR">Additional Round</option>
                      
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-2  text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quota</label>
                    <select
                      value={quota}
                      onChange={(e) => setQuota(e.target.value)}
                      className={`w-full rounded-lg  md:px-4 px-3 text-sm md:text-base py-2 md:py-3 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="HS">Home State (HS)</option>
                      <option value="AI">All India (AI)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={predictColleges}
                  disabled={!rank || collegeData.length === 0}
                  className={`w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white md:text-base text-sm md:font-bold font-semibold md:py-3 py-2 px-4 md:px-6 rounded-lg transition-all ${
                    !rank || collegeData.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-500 hover:to-orange-400 shadow-md hover:shadow-lg'
                  } flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="md:h-5 h-4 w-4 md:w-5 animate-spin" />
                      Loading Data...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="md:h-5 h-4 w-4 md:w-5" />
                      Predict Colleges
                    </>
                  )}
                </button>
              </div>
            </div>

            {showResultsSection && (
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <h3 className={`md:text-xl text-base font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Predicted Colleges ({filteredColleges.length} of {predictedColleges.length})
                  </h3>
                  <div className="flex sm:justify-between sm:items-center flex-wrap md:gap-2 gap-10">
                    <button
                      onClick={copyResults}
                      className={`md:py-2 py-1 px-3 text-xs md:px-4 rounded-lg md:text-sm font-medium flex items-center gap-2 ${
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
                        state,
                        round,
                        counsellingType,
                        rank, 
                        category, 
                        gender, 
                        quota, 
                        colleges: filteredColleges 
                      }} />}
                      fileName={`college-predictions-${rank}.pdf`}
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white md:py-2 py-1 px-3 text-xs md:px-4 rounded-lg md:text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {({ loading }) => loading ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
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
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        debouncedApplyFilters();
                      }}
                      className={`block w-full md:px-10 px-6 md:text-base text-sm  py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Search by institute name"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        onClick={applyFilters}
                        className={`p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={programFilter}
                      onChange={(e) => {
                        setProgramFilter(e.target.value);
                        debouncedApplyFilters();
                      }}
                      className={`block w-full md:px-10 px-6 md:text-base text-sm py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Filter by program name"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        onClick={applyFilters}
                        className={`p-1 mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    disabled={!searchTerm && !programFilter}
                    className={`md:py-2 py-1 px-3 md:text-base text-sm md:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      !searchTerm && !programFilter ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Clear Filters
                  </button>
                </div>

                <div className="space-y-4">
                  {showNoFilterResults ? (
                    <div className={`md:p-8 p-6 rounded-lg text-center ${
                      darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                    }`}>
                      <div className={`flex flex-col items-center ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <img src={EmptyStateIllustration} alt="No results" className="md:h-56 h-44" loading="lazy" />
                        {/* <h4 className="md:text-lg text-sm font-medium">No colleges match your filters</h4> */}
                        <p className="mt-1">Try different search terms or clear filters</p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium md:py-2 py-1 px-3 md:text-base text-sm md:px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {displayedCollegesMemo.length > 0 && (
                        <List
                          height={Math.min(600, displayedCollegesMemo.length * CARD_HEIGHT)}
                          itemCount={displayedCollegesMemo.length}
                          itemSize={CARD_HEIGHT}
                          width="100%"
                        >
                          {CollegeListRow}
                        </List>
                      )}

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
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                  >
                    <h4 className={`flex items-center text-base md:text-lg font-medium mb-4 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <EnvelopeIcon className="md:w-6 w-5 h-5 md:h-6 mr-2 text-blue-500" />
                      Email Results (PDF + Details)
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className={`w-full rounded-lg md:px-4 px-3 py-2 text-sm md:text-base md:py-3 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                          }`}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium md:py-3 py-2 px-4 text-sm md:text-base md:px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px] shadow-md hover:shadow-lg"
                      >
                        {isSending ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : 'Send Email'}
                      </button>
                    </div>
                    <p className={`mt-2 text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      We'll send a detailed PDF report to your email
                    </p>
                  </form>
                )}
              </div>
            )}

            {showNoResultsMessage && (
              <div className={`mt-6 md:p-8 p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <img src={EmptyStateIllustration} alt="No results" className="md:h-56 h-44" loading="lazy" />
                  {/* <h4 className="text-base md:text-xl font-medium mb-2">No colleges found for your criteria</h4> */}
                  <p className="mb-4 md:text-base text-sm">Try adjusting your rank or filters</p>
                  <button
                    onClick={() => {
                      setRank("");
                      setHasSearched(false);
                      formRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium md:py-2 md:text-base text-sm py-1 px-4 md:px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="md:text-2xl text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Prediction History
                  </h4>
                  <button
                    onClick={clearAllHistory}
                    className={`md:px-4 px-3 py-1 md:py-2 text-xs md:text-sm rounded-lg transition-colors flex items-center gap-2 ${
                      darkMode 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-red-400 hover:bg-red-500 text-white'
                    }`}
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className={`relative group md:p-5 p-4 rounded-xl border shadow-lg transition-all ${
                        darkMode 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500' 
                          : 'bg-white border-gray-200 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`font-bold text-base md:text-lg ${
                            darkMode ? 'text-purple-300' : 'text-purple-600'
                          }`}>Rank {item.rank}</span>
                          <span className={`ml-2 md:px-2 px-1  md:py-1 text-xs rounded-full ${
                            darkMode ? 'bg-gray-700 text-blue-300' : 'bg-gray-200 text-blue-600'
                          }`}>
                            {item.category}
                          </span>
                          <div className={`mt-2 text-xs  md:text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <span className={`font-bold ${
                              darkMode ? 'text-orange-400' : 'text-orange-500'
                            }`}>{item.predictedCount}</span> colleges predicted
                          </div>
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteHistoryItem(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        title="Delete"
                      >
                        ×
                      </button>
                      
                      <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end gap-2">
                        <button 
                          className={`md:text-sm text-xs p px-3 md:py-1 rounded-lg transition-colors ${
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
          </>
        )}
      </main>

      <footer className={`py-8 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} mt-12`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h4 className="text-lg font-bold mb-2 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                College Predictor Pro
              </h4>
              <p className="text-sm">
                © {new Date().getFullYear()} All rights reserved. Data sourced from official portals.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-4 mb-4">
                <a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  JoSAA
                </a>
                <a href="https://csab.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  CSAB
                </a>
                <a href="https://jeemain.nta.nic.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  JEE Main
                </a>
              </div>
              <div className="text-xs">
                Disclaimer: Predictions are based on historical data and may vary
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StateCollegePredictor;