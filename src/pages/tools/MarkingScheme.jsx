import { useState, useEffect } from 'react';
import { saveCalculation, getCalculations } from '../../utils/tools';
import { CalculatorIcon, ClipboardIcon, TrashIcon } from '@heroicons/react/24/outline';

const MarkingSchemeTool = () => {
  const [examType, setExamType] = useState('JEE');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState('');
  const [unattempted, setUnattempted] = useState('');
  const [totalMarks, setTotalMarks] = useState(null);
  const [history, setHistory] = useState([]);

  const examConfigs = {
    JEE: {
      correctMark: 4,
      incorrectMark: -1,
      description: 'JEE Main Marking Scheme',
      maxQuestions: 90,
      color: 'blue',
      bgFrom: 'from-blue-600',
      bgTo: 'to-orange-600'
    },
    NEET: {
      correctMark: 4,
      incorrectMark: -1,
      description: 'NEET Marking Scheme',
      maxQuestions: 200,
      color: 'green',
      bgFrom: 'from-green-600',
      bgTo: 'to-orange-600'
    },
    OTHER: {
      correctMark: 1,
      incorrectMark: -0.25,
      description: 'General Marking Scheme',
      maxQuestions: 100,
      color: 'gray',
      bgFrom: 'from-gray-600',
      bgTo: 'to-orange-600'
    }
  };

  useEffect(() => {
    const savedHistory = getCalculations('marking-scheme');
    if (savedHistory) {
      setHistory(savedHistory.slice(0, 5));
    } else {
      setHistory([]);
    }
  }, []);

  const calculateMarks = () => {
    const config = examConfigs[examType];
    const correct = parseInt(correctAnswers) || 0;
    const incorrect = parseInt(incorrectAnswers) || 0;
    const unattemptedCount = parseInt(unattempted) || 0;
  
    if (correct < 0 || incorrect < 0 || unattemptedCount < 0) {
      alert('Please enter positive numbers');
      return;
    }
  
    const totalAnswered = correct + incorrect;
    if (totalAnswered + unattemptedCount > config.maxQuestions) {
      alert(`Total questions cannot exceed ${config.maxQuestions} for ${examType}`);
      return;
    }
  
    const marks = (correct * config.correctMark) + (incorrect * config.incorrectMark);
    setTotalMarks(marks);
  
    const calculation = {
      examType,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unattempted: unattemptedCount,
      totalMarks: marks,
      timestamp: new Date().toISOString()
    };
    const currentHistory = getCalculations('marking-scheme');
    saveCalculation('marking-scheme', calculation);
    setHistory([calculation, ...currentHistory.slice(0, 4)]);
  };

  const copyResults = () => {
    const config = examConfigs[examType];
    const text = `${config.description}\nCorrect: ${correctAnswers}\nIncorrect: ${incorrectAnswers}\nUnattempted: ${unattempted}\nTotal Marks: ${totalMarks}`;
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const deleteHistoryItem = (index) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      localStorage.setItem('marking-scheme-history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const resetCalculator = () => {
    setCorrectAnswers('');
    setIncorrectAnswers('');
    setUnattempted('');
    setTotalMarks(null);
  };

  const currentConfig = examConfigs[examType];

  return (
    <div className="max-w-7xl mx-auto">
      <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
        <h2 className="text-2xl font-bold">{currentConfig.description}</h2>
        <p className="opacity-90">Calculate your expected score based on response pattern</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => {
                setExamType(e.target.value);
                resetCalculator();
              }}
              className="w-full bg-gray-100 text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="JEE">JEE Main</option>
              <option value="NEET">NEET</option>
              <option value="OTHER">Other Exams</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Correct Answers</label>
            <input
              type="number"
              value={correctAnswers}
              onChange={(e) => setCorrectAnswers(e.target.value)}
              className="w-full bg-gray-100 text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min="0"
              max={currentConfig.maxQuestions}
              placeholder="Correct answers"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Incorrect Answers</label>
            <input
              type="number"
              value={incorrectAnswers}
              onChange={(e) => setIncorrectAnswers(e.target.value)}
              className="w-full bg-gray-100 text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min="0"
              max={currentConfig.maxQuestions}
              placeholder="Incorrect answers"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Unattempted</label>
            <input
              type="number"
              value={unattempted}
              onChange={(e) => setUnattempted(e.target.value)}
              className="w-full bg-gray-100 border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min="0"
              max={currentConfig.maxQuestions}
              placeholder="Unattempted questions"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={calculateMarks}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-1"
          >
            <CalculatorIcon className="w-5 h-5" />
            Calculate Marks
          </button>
          <button
            onClick={resetCalculator}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {totalMarks !== null && (
          <div className="mt-6 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">Result</h3>
                <button
                  onClick={copyResults}
                  className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <ClipboardIcon className="w-5 h-5" />
                  Copy
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Correct Answers</p>
                  <p className="text-xl sm:text-2xl text-black/90 font-bold">{correctAnswers}</p>
                </div>
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm text-red-600">Incorrect Answers</p>
                  <p className="text-xl sm:text-2xl text-black/90 font-bold">{incorrectAnswers}</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm text-green-600">Total Marks</p>
                  <p className="text-xl sm:text-2xl text-black/90 font-bold">{totalMarks}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Calculations</h3>
            <div className="space-y-2">
              {history.map((item, index) => {
                const itemConfig = examConfigs[item.examType];
                return (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setExamType(item.examType);
                      setCorrectAnswers(item.correctAnswers);
                      setIncorrectAnswers(item.incorrectAnswers);
                      setUnattempted(item.unattempted || '');
                      setTotalMarks(item.totalMarks);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          item.examType === 'JEE' ? 'text-blue-600' :
                          item.examType === 'NEET' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {item.examType}
                        </span>
                        <span className="font-bold text-black/70">{item.totalMarks} marks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkingSchemeTool;