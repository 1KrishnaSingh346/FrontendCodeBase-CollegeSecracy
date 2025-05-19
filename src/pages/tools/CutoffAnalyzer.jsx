import { useState, useEffect } from 'react';
import { saveCalculation, getCalculations } from '../../utils/tools';
import { AcademicCapIcon, ClipboardIcon, TrashIcon } from '@heroicons/react/24/outline';

const CutoffAnalyzerTool = () => {
  const [examType, setExamType] = useState('JEE');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const cutoffData = {
    JEE: {
      General: { 
        minRank: 1, 
        maxRank: 250000, 
        colleges: ["IITs", "NITs", "IIITs", "GFTIs"],
        color: 'blue'
      },
      OBC: { 
        minRank: 1, 
        maxRank: 350000, 
        colleges: ["IITs", "NITs", "IIITs"],
        color: 'blue'
      },
      SC: { 
        minRank: 1, 
        maxRank: 500000, 
        colleges: ["IITs", "NITs"],
        color: 'blue'
      },
      ST: { 
        minRank: 1, 
        maxRank: 550000, 
        colleges: ["IITs", "NITs"],
        color: 'blue'
      }
    },
    NEET: {
      General: { 
        minRank: 1, 
        maxRank: 700000, 
        colleges: ["MBBS", "BDS", "AIIMS", "JIPMER"],
        color: 'green'
      },
      OBC: { 
        minRank: 1, 
        maxRank: 900000, 
        colleges: ["MBBS", "BDS"],
        color: 'green'
      },
      SC: { 
        minRank: 1, 
        maxRank: 1200000, 
        colleges: ["MBBS"],
        color: 'green'
      },
      ST: { 
        minRank: 1, 
        maxRank: 1300000, 
        colleges: ["MBBS"],
        color: 'green'
      }
    },
    OTHER: {
      General: { 
        minRank: 1, 
        maxRank: 10000, 
        colleges: ["Top Colleges"],
        color: 'gray'
      },
      OBC: { 
        minRank: 1, 
        maxRank: 15000, 
        colleges: ["Top Colleges"],
        color: 'gray'
      },
      SC: { 
        minRank: 1, 
        maxRank: 20000, 
        colleges: ["Good Colleges"],
        color: 'gray'
      },
      ST: { 
        minRank: 1, 
        maxRank: 25000, 
        colleges: ["Good Colleges"],
        color: 'gray'
      }
    }
  };

  useEffect(() => {
    const savedHistory = getCalculations('cutoff-analyzer');
    if (savedHistory) {
      setHistory(savedHistory.slice(0, 5));
    } else {
      setHistory([]);
    }
  }, []);

  const analyzeCutoff = () => {
    const rankNum = parseInt(rank);
    if (!rankNum || rankNum <= 0) {
      alert('Please enter a valid rank');
      return;
    }

    const examCutoff = cutoffData[examType] || cutoffData.OTHER;
    const categoryCutoff = examCutoff[category] || examCutoff.General;
    
    const eligible = rankNum >= categoryCutoff.minRank && rankNum <= categoryCutoff.maxRank;
    setResult({
      eligible,
      colleges: categoryCutoff.colleges,
      minRank: categoryCutoff.minRank,
      maxRank: categoryCutoff.maxRank,
      color: categoryCutoff.color
    });
    
    const calculation = {
      examType,
      rank: rankNum,
      category,
      eligible,
      colleges: categoryCutoff.colleges,
      timestamp: new Date().toISOString()
    };
    
    const currentHistory = getCalculations('cutoff-analyzer');
    saveCalculation('cutoff-analyzer', calculation);
    setHistory([calculation, ...currentHistory.slice(0, 4)]);
  };

  const copyResults = () => {
    const text = `Cutoff Analysis (${examType} ${category})\nRank: ${rank}\nEligible: ${result.eligible ? 'Yes' : 'No'}\nColleges: ${result.colleges.join(', ')}`;
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const deleteHistoryItem = (index) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      localStorage.setItem('cutoff-analyzer-history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const resetCalculator = () => {
    setRank('');
    setResult(null);
  };

  return (
    <div>
      <div className={`bg-gradient-to-r from-${cutoffData[examType][category].color}-600 to-orange-600 p-6 text-white`}>
        <h2 className="text-2xl font-bold">
          {examType === 'JEE' ? 'JEE Advanced Cutoff Analyzer' : 
           examType === 'NEET' ? 'NEET Cutoff Analyzer' : 'General Cutoff Analyzer'}
        </h2>
        <p className="opacity-90">Check your eligibility for top colleges based on rank</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => {
                setExamType(e.target.value);
                resetCalculator();
              }}
              className="w-full bg-gray-100 border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="JEE">JEE Advanced</option>
              <option value="NEET">NEET</option>
              <option value="OTHER">Other Exams</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Your Rank</label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg text-black px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min="1"
              placeholder="Enter your rank"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                resetCalculator();
              }}
              className="w-full bg-gray-100 border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={analyzeCutoff}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Analyze Cutoff
          </button>
          <button
            onClick={resetCalculator}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 space-y-4">
            <div className={`bg-${result.color}-50 border border-${result.color}-200 rounded-lg p-6 shadow-sm`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {result.eligible ? (
                    <span className="text-green-600">Eligible for Admission</span>
                  ) : (
                    <span className="text-red-600">Not Eligible</span>
                  )}
                </h3>
                <button
                  onClick={copyResults}
                  className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <ClipboardIcon className="w-5 h-5" />
                  Copy
                </button>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">
                  Your rank <span className="font-bold">{rank}</span> is{' '}
                  {result.eligible ? 'within' : 'outside'} the {examType} {category} cutoff range of{' '}
                  <span className="font-bold ">{result.minRank.toLocaleString()}</span> to{' '}
                  <span className="font-bold">{result.maxRank.toLocaleString()}</span>
                </p>

                {result.eligible && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Eligible Colleges:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.colleges.map((college, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 text-black flex items-center gap-2">
                          <AcademicCapIcon className={`w-5 h-5 text-${result.color}-600`} />
                          <span>{college}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Analyses</h3>
            <div className="space-y-2">
              {history.map((item, index) => {
                const color = cutoffData[item.examType]?.[item.category]?.color || 'gray';
                return (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setExamType(item.examType);
                      setCategory(item.category);
                      setRank(item.rank);
                      setResult({
                        eligible: item.eligible,
                        colleges: item.colleges,
                        minRank: cutoffData[item.examType]?.[item.category]?.minRank || 1,
                        maxRank: cutoffData[item.examType]?.[item.category]?.maxRank || 10000,
                        color
                      });
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-medium text-${color}-600`}>
                          {item.examType} {item.category}
                        </span>
                        <span className="ml-2 font-bold text-black/80">Rank {item.rank.toLocaleString()}</span>
                        <span className={`ml-2 ${item.eligible ? 'text-green-600' : 'text-red-600'}`}>
                          {item.eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
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

export default CutoffAnalyzerTool;