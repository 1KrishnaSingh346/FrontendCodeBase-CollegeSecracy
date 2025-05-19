import { useState, useEffect, useRef } from "react";
import ToolLayout from "../../components/tools/ToolLayout";
import { saveCalculation, getCalculations } from "../../utils/tools";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import CGPAReportPDF from "../../components/tools/CGPAReportPDF";
import { 
  EnvelopeIcon, 
  CalculatorIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowPathIcon,
  ClipboardIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/outline";

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState([
    { id: 1, sgpa: "", credits: "" },
    { id: 2, sgpa: "", credits: "" }
  ]);
  const [cgpa, setCgpa] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [history, setHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    setHistory(getCalculations('cgpa-calculator'));
  }, []);

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

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log("Sending to:", email, "\nResults:", { cgpa, percentage });
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Results sent to ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const resetCalculator = () => {
    setSemesters([
      { id: 1, sgpa: "", credits: "" },
      { id: 2, sgpa: "", credits: "" }
    ]);
    setCgpa(null);
    setPercentage(null);
  };

  return (
    <ToolLayout 
      title="CGPA Calculator" 
      description="Calculate your cumulative GPA across multiple semesters"
    >
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {/* Semester Input Cards */}
          <div className="space-y-3">
            {semesters.map((semester) => (
              <motion.div 
                key={semester.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Semester {semester.id}
                  </h3>
                  {semesters.length > 2 && (
                    <button
                      onClick={() => removeSemester(semester.id)}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 transition-colors"
                      aria-label="Remove semester"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1 text-sm">SGPA</label>
                    <input
                      type="number"
                      value={semester.sgpa}
                      onChange={(e) => handleSemesterChange(semester.id, 'sgpa', e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                      min="0"
                      max="10"
                      step="0.01"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1 text-sm">Credits</label>
                    <input
                      type="number"
                      value={semester.credits}
                      onChange={(e) => handleSemesterChange(semester.id, 'credits', e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                      min="0"
                      placeholder="e.g. 24"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addSemester}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-sm flex items-center transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Semester
            </button>
            
            <button
              onClick={calculateCGPA}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex-1 md:flex-none flex items-center justify-center transition-colors"
            >
              <CalculatorIcon className="w-4 h-4 mr-1" />
              Calculate CGPA
            </button>
          </div>
        </div>

        {/* Results Section */}
        {cgpa !== null && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-500">
                <h3 className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-400 mb-1 md:mb-2">Your CGPA</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300">{cgpa}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    {semesters.length} semester(s)
                  </span>
                </div>
              </div>
              
              <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-500">
                <h3 className="text-lg md:text-xl font-bold text-orange-700 dark:text-orange-400 mb-1 md:mb-2">Percentage</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300">{percentage}%</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    (CGPA × 9.5)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={copyResults}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-sm flex items-center transition-colors"
              >
                <ClipboardIcon className="w-4 h-4 mr-1" />
                Copy Results
              </button>
              
              <PDFDownloadLink
                document={<CGPAReportPDF data={{ semesters, cgpa, percentage }} />}
                fileName={`cgpa-report.pdf`}
                className="bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-sm flex items-center transition-colors"
              >
                {({ loading }) => (
                  <>
                    <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                    {loading ? 'Preparing...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
              
              <button
                onClick={resetCalculator}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-sm flex items-center transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>

            {/* Email Form */}
            <form ref={formRef} onSubmit={sendEmail} className="bg-gray-50 dark:bg-gray-700/30 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-gray-700 dark:text-gray-300 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Email Results
              </h4>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600 text-sm md:text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center text-sm md:text-base"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-6 md:mt-8">
            <h4 className="text-gray-700 dark:text-gray-400 mb-2 text-sm md:text-base font-medium">
              Previous Calculations:
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {history.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-700 p-2 md:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group relative border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          CGPA: <span className="font-medium">{item.cgpa}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 dark:text-orange-400 text-xs md:text-sm whitespace-nowrap">
                        {item.semesters.length} semester(s)
                      </span>
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
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 transition-colors"
                        aria-label="Delete calculation"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CGPACalculator;