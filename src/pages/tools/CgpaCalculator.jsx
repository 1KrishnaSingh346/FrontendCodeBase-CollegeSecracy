import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import CGPAReportPDF from "../../components/tools/CGPAReportPDF";
import useAuthStore from "@/store/useAuthStore";
import { 
  CalculatorIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowPathIcon,
  ClipboardIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const CGPACalculator = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [semesters, setSemesters] = useState([
    { id: 1, sgpa: "", credits: "" },
    { id: 2, sgpa: "", credits: "" }
  ]);
  const [cgpa, setCgpa] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [history, setHistory] = useState([]);
  const formRef = useRef();
  const semestersContainerRef = useRef(null);
  const {user} = useAuthStore();

  // Inline SVG Components
  const StudentIllustration = () => (
    <svg width="100%" height="auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="100" r="60" fill="#3B82F6" fillOpacity="0.2"/>
      <circle cx="200" cy="80" r="30" fill="#3B82F6"/>
      <path d="M200 110C220 110 236.667 123.333 240 140H160C163.333 123.333 180 110 200 110Z" fill="white"/>
      <path d="M170 85C170 85 175 75 200 75C225 75 230 85 230 85" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M200 140V200" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"/>
      <path d="M200 160L160 180" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"/>
      <path d="M200 160L240 180" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"/>
      <path d="M200 200L170 260" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"/>
      <path d="M200 200L230 260" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"/>
      <path d="M140 120L80 100" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
      <path d="M260 120L320 100" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );

  const BookIllustration = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const GradCapIllustration = () => (
    <svg width="100%" height="auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 150L200 80L350 150L200 220L50 150Z" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M200 80V150" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M200 150V220" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M50 150L50 200" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M350 150L350 200" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M50 200L350 200" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M200 150L200 200" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M125 150L125 175" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M275 150L275 175" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M125 175L275 175" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M200 175L200 200" stroke="#3B82F6" strokeWidth="2"/>
    </svg>
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    setHistory(getCalculations('cgpa-calculator'));
  }, []);


  useEffect(() => {
    // Scroll to bottom when new semester is added
    if (semestersContainerRef.current) {
      semestersContainerRef.current.scrollTop = semestersContainerRef.current.scrollHeight;
    }
  }, [semesters]);

  const addSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1;
    setSemesters([...semesters, { id: newId, sgpa: "", credits: "" }]);
  };

  const removeSemester = (id) => {
    if (semesters.length <= 2) return;
    setSemesters(semesters.filter(sem => sem.id !== id));
    if (cgpa !== null) {
      setCgpa(null);
      setPercentage(null);
    }
  };

  const handleSemesterChange = (id, field, value) => {
    setSemesters(semesters.map(sem => 
      sem.id === id ? { ...sem, [field]: value } : sem
    ));
    if (cgpa !== null) {
      setCgpa(null);
      setPercentage(null);
    }
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let allValid = true;

    semesters.forEach(sem => {
      if (!sem.sgpa || !sem.credits) allValid = false;
      const credits = parseFloat(sem.credits) || 0;
      totalCredits += credits;
      totalGradePoints += (parseFloat(sem.sgpa) || 0) * credits;
    });

    if (!allValid || totalCredits === 0) {
      alert("Please enter valid SGPA and credits for all semesters");
      return;
    }

    const calculatedCGPA = (totalGradePoints / totalCredits).toFixed(2);
    setCgpa(calculatedCGPA);
    setPercentage((calculatedCGPA * 9.5).toFixed(2));

    const calculation = {
      semesters: semesters.map(sem => ({
        sgpa: sem.sgpa,
        credits: sem.credits
      })),
      cgpa: calculatedCGPA,
      percentage: (calculatedCGPA * 9.5).toFixed(2),
      timestamp: new Date().toISOString()
    };
    saveCalculation('cgpa-calculator', calculation);
    setHistory(getCalculations('cgpa-calculator'));
  };

  const copyResults = () => {
    const semestersText = semesters.map(sem => 
      `Sem ${sem.id}: SGPA ${sem.sgpa} (${sem.credits} credits)`
    ).join("\n");
    navigator.clipboard.writeText(
      `CGPA Calculation:\n${semestersText}\n\n` +
      `Final CGPA: ${cgpa}\n` +
      `Equivalent Percentage: ${percentage}%`
    );
    alert("Results copied to clipboard!");
  };

  const resetCalculator = () => {
    setSemesters([
      { id: 1, sgpa: "", credits: "" },
      { id: 2, sgpa: "", credits: "" }
    ]);
    setCgpa(null);
    setPercentage(null);
  };

  // Helper functions for localStorage
  const saveCalculation = (key, data) => {
    const history = JSON.parse(localStorage.getItem(`${key}-history`) || '[]');
    history.unshift(data);
    localStorage.setItem(`${key}-history`, JSON.stringify(history.slice(0, 10))); // Keep last 10
  };

  const getCalculations = (key) => {
    return JSON.parse(localStorage.getItem(`${key}-history`) || '[]');
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm md:text-base">Back</span>
            </button>
            
            <div className="text-center px-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">CGPA Calculator</h1>
              <p className="text-xs md:text-sm opacity-90 mt-1">
                Calculate your cumulative GPA across multiple semesters
              </p>
            </div>
            
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Left Column - Illustration (Desktop only) */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                {cgpa ? (
                  <div className="relative">
                    <GradCapIllustration />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">{cgpa}</span>
                      <p className="text-base md:text-lg mt-2 text-gray-700 dark:text-gray-300">Your CGPA</p>
                    </div>
                  </div>
                ) : (
                  <StudentIllustration />
                )}
                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-base md:text-lg text-gray-800 dark:text-gray-200 mb-2">How it works</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span> Enter your SGPA and credits for each semester
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span> Add or remove semesters as needed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span> Click "Calculate" to get your CGPA
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span> Percentage is calculated as CGPA × 9.5
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Calculator */}
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 md:space-y-6">
                {/* Semester Input Cards */}
                <div className="space-y-3">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <BookIllustration />
                    <span>Semester Details</span>
                  </h2>
                  
                  <div 
                    ref={semestersContainerRef}
                    className="max-h-[300px] md:max-h-[400px] overflow-y-auto scrollbar-hide pr-2 space-y-3"
                  >
                    {semesters.map((semester) => (
                      <motion.div 
                        key={semester.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 dark:bg-gray-700/30 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-center mb-2 md:mb-3">
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center text-sm md:text-base">
                            <span className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mr-2 text-xs md:text-sm">
                              {semester.id}
                            </span>
                            Semester {semester.id}
                          </h3>
                          {semesters.length > 2 && (
                            <button
                              onClick={() => removeSemester(semester.id)}
                              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 transition-colors"
                              aria-label="Remove semester"
                            >
                              <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                          <div>
                            <label className="block text-gray-600 dark:text-gray-400 mb-1 text-xs md:text-sm">SGPA (0-10)</label>
                            <input
                              type="number"
                              value={semester.sgpa}
                              onChange={(e) => handleSemesterChange(semester.id, 'sgpa', e.target.value)}
                              className="w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600 text-sm md:text-base"
                              min="0"
                              max="10"
                              step="0.01"
                              placeholder="e.g. 8.5"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-600 dark:text-gray-400 mb-1 text-xs md:text-sm">Total Credits</label>
                            <input
                              type="number"
                              value={semester.credits}
                              onChange={(e) => handleSemesterChange(semester.id, 'credits', e.target.value)}
                              className="w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600 text-sm md:text-base"
                              min="0"
                              placeholder="e.g. 24"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button
                    onClick={addSemester}
                    className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium flex items-center transition-colors flex-1 md:flex-none"
                  >
                    <PlusIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Add Semester
                  </button>
                  
                  <button
                    onClick={calculateCGPA}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-4 md:px-6 rounded-lg flex-1 md:flex-none flex items-center justify-center transition-colors shadow-md text-xs md:text-sm"
                  >
                    <CalculatorIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Calculate CGPA
                  </button>
                </div>

                {/* Results Section */}
                {cgpa !== null && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 md:mt-6 space-y-4 md:space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-blue-700 dark:text-blue-400 mb-1 md:mb-2">Your CGPA</h3>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-800 dark:text-blue-300">{cgpa}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                            {semesters.length} semester(s)
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-lg md:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-orange-700 dark:text-orange-400 mb-1 md:mb-2">Percentage</h3>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-800 dark:text-orange-300">{percentage}%</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                            (CGPA × 9.5)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result Actions */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="text-gray-700 dark:text-gray-300 mb-2 md:mb-3 font-medium flex items-center gap-2 text-sm md:text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Save or Share Results
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        <button
                          onClick={copyResults}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-xs md:text-sm font-medium flex items-center transition-colors flex-1"
                        >
                          <ClipboardIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          Copy
                        </button>
                        
                        <PDFDownloadLink
                          document={<CGPAReportPDF data={{ semesters, cgpa, percentage, user}} />}
                          fileName={`cgpa-report.pdf`}
                          className="bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-xs md:text-sm font-medium flex items-center transition-colors flex-1 justify-center"
                        >
                          {({ loading }) => (
                            <>
                              <DocumentArrowDownIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                              {loading ? 'Preparing...' : 'PDF'}
                            </>
                          )}
                        </PDFDownloadLink>
                        
                        <button
                          onClick={resetCalculator}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-xs md:text-sm font-medium flex items-center transition-colors flex-1"
                        >
                          <ArrowPathIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* History Section */}
                {history.length > 0 && (
                  <div className="mt-6 md:mt-8">
                    <h4 className="text-gray-700 dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base font-medium flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      Calculation History
                    </h4>
                    <div className="max-h-[200px] md:max-h-[300px] overflow-y-auto pr-2 space-y-2">
                      {history.map((item, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="bg-gray-50 dark:bg-gray-700 p-2 md:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group relative border border-gray-200 dark:border-gray-600 cursor-pointer"
                          onClick={() => {
                            setSemesters(item.semesters.map((sem, i) => ({
                              id: i + 1,
                              sgpa: sem.sgpa,
                              credits: sem.credits
                            })));
                            setCgpa(item.cgpa);
                            setPercentage(item.percentage);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-base md:text-lg font-medium text-blue-600 dark:text-blue-400">
                                  {item.cgpa}
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                  ({item.semesters.length} semesters)
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(item.timestamp).toLocaleString()}
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("Are you sure you want to delete this calculation?")) {
                                  const updatedHistory = [...history];
                                  updatedHistory.splice(index, 1);
                                  localStorage.setItem('cgpa-calculator-history', JSON.stringify(updatedHistory));
                                  setHistory(updatedHistory);
                                }
                              }}
                              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Delete calculation"
                            >
                              <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 md:py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} CGPA Calculator | Designed for Students
          </p>
          <div className="flex justify-center gap-3 md:gap-4 mt-2">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xs md:text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xs md:text-sm">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xs md:text-sm">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CGPACalculator;