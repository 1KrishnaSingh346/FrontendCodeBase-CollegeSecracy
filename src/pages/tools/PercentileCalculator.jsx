import { useState, useEffect, useRef } from "react";
import ToolLayout from "../../components/tools/ToolLayout";
import { saveCalculation, getCalculations } from "../../utils/tools";
import { marksToPercentile } from "../../utils/CollegeData.js";
import { ClipboardIcon, CalculatorIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// Sample JEE Main related images from Unsplash
const jeeHeroImage = "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80";
const successImage = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

const PercentileCalculator = () => {
  const [marks, setMarks] = useState("");
  const [percentile, setPercentile] = useState(null);
  const [rank, setRank] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  // Candidates appeared in JEE Main 2025
  const totalCandidates = 1475103;

  useEffect(() => {
    setHistory(getCalculations('jee-percentile'));
  }, []);

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

  const calculateRank = (percentile) => {
    const rank = Math.round(((100 - percentile) * totalCandidates) / 100);
    return Math.max(1, rank);
  };

  const calculateJeePercentile = () => {
    setLoading(true);
    try {
      const marksValue = parseFloat(marks);
      if (isNaN(marksValue)){
        alert("Please enter valid marks");
        return;
      }

      const calculatedPercentile = calculateExactPercentile(marksValue);
      const calculatedRank = calculateRank(calculatedPercentile);

      setPercentile(calculatedPercentile);
      setRank(calculatedRank);

      const calculation = {
        marks: marksValue,
        percentile: calculatedPercentile,
        rank: calculatedRank,
        timestamp: new Date().toISOString()
      };

      saveCalculation('jee-percentile', calculation);
      setHistory(getCalculations('jee-percentile'));
    } catch (error) {
      console.error("Calculation error:", error);
      alert("An error occurred during calculation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    const text = `JEE Main Percentile Prediction\n` +
      `Marks: ${marks}/300\n` +
      `Predicted Percentile: ${percentile.toFixed(2)}%\n` +
      `Estimated Rank: ${rank.toLocaleString()}\n` +
      `Top ${percentile.toFixed(2)}% of candidates`;
    
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  const resetCalculator = () => {
    setMarks("");
    setPercentile(null);
    setRank(null);
  };

  return (
    <ToolLayout 
      title="JEE Main Percentile Predictor" 
      description="Calculate your JEE Main percentile and rank based on your marks"
    >
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Enter Your JEE Main Marks (0-300)
              </label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                min="0"
                max="300"
                placeholder="e.g. 185"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateJeePercentile}
                disabled={loading || !marks}
                className={`bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center ${loading ? 'opacity-75' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="w-5 h-5 mr-2" />
                    Calculate Percentile
                  </>
                )}
              </button>

              {percentile !== null && (
                <button
                  onClick={resetCalculator}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {percentile !== null && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 md:p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-500">
                  <h3 className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Your Percentile
                  </h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300">
                      {percentile.toFixed(2)}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Top {percentile.toFixed(2)}% candidates
                    </span>
                  </div>
                </div>
                
                <div className="p-4 md:p-5 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-500">
                  <h3 className="text-lg md:text-xl font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Estimated Rank
                  </h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300">
                      {rank.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Out of ~1.5M candidates
                    </span>
                  </div>
                </div>
              </div>

              {/* JEE Insights */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="text-gray-700 dark:text-gray-300 mb-2 font-medium">JEE Main Insights</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Based on previous year trends, a rank ≤ {(rank * 0.8).toLocaleString()} might qualify for JEE Advanced.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={copyResult}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <ClipboardIcon className="w-5 h-5 mr-2" />
                  Copy Results
                </button>
              </div>
            </motion.div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-8">
              <h4 className="text-gray-700 dark:text-gray-300 mb-3 font-medium">Previous Calculations</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
                    onClick={() => {
                      setMarks(item.marks);
                      setPercentile(item.percentile);
                      setRank(item.rank);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {item.percentile.toFixed(2)}% ({item.marks} marks)
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Rank: {item.rank.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default PercentileCalculator;