import { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import MarkingSchemeTool from './MarkingScheme';
import CutoffAnalyzerTool from './CutoffAnalyzer';
import { CalculatorIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const ExamTools = () => {
  const [activeTool, setActiveTool] = useState('marking-scheme');
  
  // Define color themes for each tool
  const toolThemes = {
    'marking-scheme': {
      bgFrom: 'from-orange-600',
      bgTo: 'to-orange-700',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    'cutoff-analyzer': {
      bgFrom: 'from-blue-600',
      bgTo: 'to-blue-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  };

  const currentTheme = toolThemes[activeTool];
  
  return (
    <ToolLayout title="Exam Tools">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Preparation Tools</h1>
          <p className="text-gray-600 mb-8">Essential calculators for JEE, NEET, and other competitive exams</p>
          
          {/* Tool Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setActiveTool('marking-scheme')}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                activeTool === 'marking-scheme'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className={`p-2 rounded-full ${
                activeTool === 'marking-scheme' ? 'bg-orange-700' : 'bg-orange-100 text-orange-600'
              }`}>
                <CalculatorIcon className="w-6 h-6" />
              </span>
              <span className="font-medium">Marking Scheme</span>
            </button>
            
            <button
              onClick={() => setActiveTool('cutoff-analyzer')}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                activeTool === 'cutoff-analyzer'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className={`p-2 rounded-full ${
                activeTool === 'cutoff-analyzer' ? 'bg-blue-700' : 'bg-blue-100 text-blue-600'
              }`}>
                <ChartBarIcon className="w-6 h-6" />
              </span>
              <span className="font-medium">Cutoff Analyzer</span>
            </button>
          </div>
          
          {/* Tool Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {activeTool === 'marking-scheme' && (
              <MarkingSchemeTool 
                historyTheme={{
                  textColor: currentTheme.textColor,
                  bgColor: currentTheme.bgColor,
                  borderColor: currentTheme.borderColor
                }}
              />
            )}
            {activeTool === 'cutoff-analyzer' && (
              <CutoffAnalyzerTool 
                historyTheme={{
                  textColor: currentTheme.textColor,
                  bgColor: currentTheme.bgColor,
                  borderColor: currentTheme.borderColor
                }}
              />
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ExamTools;