import { useState } from 'react';
import { 
  FiInfo, 
  FiBarChart2, 
  FiDollarSign, 
  FiBriefcase, 
  FiAward,
  FiCheck,
  FiX,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiShare2
} from 'react-icons/fi';

const BranchComparison = () => {
  const [selectedBranches, setSelectedBranches] = useState(['CSE', 'ECE']);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedRows, setExpandedRows] = useState({});
  const [showBranchSelector, setShowBranchSelector] = useState(false);

  const branches = {
    'CSE': {
      name: 'Computer Science Engineering',
      overview: 'Focuses on computation, algorithms, programming languages, program design, software, and computer hardware.',
      salary: '₹6-20 LPA (Fresh graduates)',
      demand: 'Very High',
      growth: '25% (5-year projected)',
      subjects: ['Data Structures', 'Algorithms', 'DBMS', 'OS', 'Computer Networks', 'AI/ML', 'Cloud Computing'],
      pros: ['High salary', 'Abundant job opportunities', 'Global demand', 'Versatile skills', 'Entrepreneurial options'],
      cons: ['Highly competitive', 'Rapidly changing technologies', 'Can be stressful', 'Need continuous learning'],
      colleges: ['IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'DTU', 'VIT Vellore'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Flipkart', 'Goldman Sachs']
    },
    'ECE': {
      name: 'Electronics & Communication Engineering',
      overview: 'Deals with electronic devices, circuits, communication equipment, and basic electronics with applications in telecom, hardware, and embedded systems.',
      salary: '₹4-15 LPA (Fresh graduates)',
      demand: 'High',
      growth: '18% (5-year projected)',
      subjects: ['Digital Electronics', 'Signal Processing', 'VLSI', 'Embedded Systems', 'Communication Systems', 'IoT', 'Wireless Networks'],
      pros: ['Diverse career options', 'Hardware+software combination', 'Growing IoT field', 'Defense sector opportunities'],
      cons: ['Core jobs less abundant', 'Need higher education for best roles', 'Fewer product companies'],
      colleges: ['IIT Delhi', 'NIT Warangal', 'DTU', 'NSIT', 'IIIT Bangalore', 'PEC Chandigarh'],
      companies: ['Qualcomm', 'Intel', 'Samsung', 'Texas Instruments', 'Huawei', 'ISRO']
    },
    'ME': {
      name: 'Mechanical Engineering',
      overview: 'Design, analysis, manufacturing, and maintenance of mechanical systems with applications in automotive, aerospace, energy, and robotics.',
      salary: '₹3.5-12 LPA (Fresh graduates)',
      demand: 'Moderate',
      growth: '12% (5-year projected)',
      subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Robotics', 'CAD/CAM'],
      pros: ['Broad applicability', 'Always relevant', 'Diverse industries', 'Global opportunities'],
      cons: ['Lower starting salaries', 'Fewer high-growth companies', 'Slow promotion cycles'],
      colleges: ['IIT Madras', 'NIT Surathkal', 'COEP Pune', 'Jadavpur University', 'BITS Goa', 'VNIT Nagpur'],
      companies: ['TATA Motors', 'L&T', 'Siemens', 'Bosch', 'DRDO', 'Schneider Electric']
    },
    'CE': {
      name: 'Civil Engineering',
      overview: 'Design, construction, and maintenance of physical infrastructure including buildings, roads, bridges, and water systems.',
      salary: '₹3-10 LPA (Fresh graduates)',
      demand: 'Moderate',
      growth: '10% (5-year projected)',
      subjects: ['Structural Analysis', 'Geotechnical', 'Transportation', 'Environmental', 'Construction', 'Surveying'],
      pros: ['Job stability', 'Government opportunities', 'Entrepreneurial options', 'Field work variety'],
      cons: ['Slower salary growth', 'Project-based work', 'Site conditions can be tough'],
      colleges: ['IIT Roorkee', 'NIT Calicut', 'Jamia Millia', 'Anna University', 'SVNIT Surat', 'NIT Patna'],
      companies: ['L&T Construction', 'Shapoorji Pallonji', 'Afcons', 'DRDO', 'NHAI', 'Jacobs']
    },
    'EE': {
      name: 'Electrical Engineering',
      overview: 'Study and application of electricity, electronics, and electromagnetism with applications in power systems, automation, and electronics.',
      salary: '₹4-14 LPA (Fresh graduates)',
      demand: 'High',
      growth: '15% (5-year projected)',
      subjects: ['Power Systems', 'Control Systems', 'Machines', 'Measurements', 'Renewable Energy', 'Smart Grid'],
      pros: ['Core sector jobs', 'Power industry demand', 'Diverse roles', 'Government sector options'],
      cons: ['Fewer product companies', 'Need specialization', 'Field work can be demanding'],
      colleges: ['IIT Kharagpur', 'NIT Karnataka', 'VJTI Mumbai', 'PEC Chandigarh', 'NIT Rourkela', 'Jadavpur University'],
      companies: ['Siemens', 'ABB', 'BHEL', 'TATA Power', 'Adani Transmission', 'Power Grid Corp']
    }
  };

  const toggleBranch = (branch) => {
    if (selectedBranches.includes(branch)) {
      if (selectedBranches.length > 1) {
        setSelectedBranches(selectedBranches.filter(b => b !== branch));
      }
    } else {
      if (selectedBranches.length < 3) {
        setSelectedBranches([...selectedBranches, branch]);
      }
    }
  };

  const toggleRowExpansion = (rowKey) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }));
  };

  const getDemandColor = (demand) => {
    switch(demand) {
      case 'Very High': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200';
      case 'High': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'Moderate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const downloadReport = () => {
    // In a real app, this would generate a PDF or download data
    alert('Downloading comparison report...');
  };

  const shareComparison = () => {
    // In a real app, this would use Web Share API or similar
    alert('Sharing comparison...');
  };

  return (
    <div className="bg-white dark:bg-gray-850 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-600 dark:text-blue-400" />
              Engineering Branch Comparison
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Compare key metrics across different engineering disciplines
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={downloadReport}
              className="flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiDownload className="mr-1.5" /> Export
            </button>
            <button 
              onClick={shareComparison}
              className="flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiShare2 className="mr-1.5" /> Share
            </button>
          </div>
        </div>
        
        {/* Branch Selector - Mobile */}
        <div className="sm:hidden mb-4">
          <button 
            onClick={() => setShowBranchSelector(!showBranchSelector)}
            className="w-full flex justify-between items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            <span>Selected Branches: {selectedBranches.join(', ')}</span>
            {showBranchSelector ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {showBranchSelector && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branches (2-3)</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(branches).map(branch => (
                  <button
                    key={branch}
                    onClick={() => toggleBranch(branch)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBranches.includes(branch)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Branch Selector - Desktop */}
        <div className="hidden sm:block mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branches to Compare (2-3)</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(branches).map(branch => (
              <button
                key={branch}
                onClick={() => toggleBranch(branch)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedBranches.includes(branch)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>
        
        {selectedBranches.length > 0 && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FiInfo className="mr-2" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('career')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'career'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FiBriefcase className="mr-2" /> Career Prospects
                </button>
                <button
                  onClick={() => setActiveTab('colleges')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'colleges'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FiAward className="mr-2" /> Top Colleges
                </button>
                <button
                  onClick={() => setActiveTab('companies')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'companies'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FiBriefcase className="mr-2" /> Recruiting Companies
                </button>
              </nav>
            </div>
            
            {/* Comparison Table */}
            <div className="overflow-hidden">
              <div className="min-w-full">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                          {branches[branch].name}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Overview</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          {branches[branch].overview}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Key Subjects</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          <ul className="space-y-1">
                            {branches[branch].subjects.slice(0, expandedRows['subjects'] ? branches[branch].subjects.length : 3).map(subject => (
                              <li key={subject} className="flex items-start">
                                <span className="text-blue-500 mr-1.5">•</span> {subject}
                              </li>
                            ))}
                          </ul>
                          {branches[branch].subjects.length > 3 && (
                            <button 
                              onClick={() => toggleRowExpansion('subjects')}
                              className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              {expandedRows['subjects'] ? 'Show less' : `Show ${branches[branch].subjects.length - 3} more`}
                              {expandedRows['subjects'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Career Tab */}
                {activeTab === 'career' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Career Metric</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                          {branch}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <FiDollarSign className="mr-1.5" /> Avg. Starting Salary
                      </div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          {branches[branch].salary}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Job Demand</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor(branches[branch].demand)}`}>
                            {branches[branch].demand}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Growth Potential</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          {branches[branch].growth}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Pros</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          <ul className="space-y-1.5">
                            {branches[branch].pros.slice(0, expandedRows['pros'] ? branches[branch].pros.length : 3).map(pro => (
                              <li key={pro} className="flex items-start">
                                <span className="text-green-500 mr-1.5"><FiCheck /></span> {pro}
                              </li>
                            ))}
                          </ul>
                          {branches[branch].pros.length > 3 && (
                            <button 
                              onClick={() => toggleRowExpansion('pros')}
                              className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              {expandedRows['pros'] ? 'Show less' : `Show ${branches[branch].pros.length - 3} more`}
                              {expandedRows['pros'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3">
                      <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Cons</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                          <ul className="space-y-1.5">
                            {branches[branch].cons.slice(0, expandedRows['cons'] ? branches[branch].cons.length : 3).map(con => (
                              <li key={con} className="flex items-start">
                                <span className="text-red-500 mr-1.5"><FiX /></span> {con}
                              </li>
                            ))}
                          </ul>
                          {branches[branch].cons.length > 3 && (
                            <button 
                              onClick={() => toggleRowExpansion('cons')}
                              className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              {expandedRows['cons'] ? 'Show less' : `Show ${branches[branch].cons.length - 3} more`}
                              {expandedRows['cons'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Colleges Tab */}
                {activeTab === 'colleges' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">College Ranking</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                          {branch}
                        </div>
                      ))}
                    </div>
                    
                    {[0, 1, 2, 3, 4, 5].map(index => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">
                          #{index + 1}
                        </div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            {branches[branch].colleges[index] || '-'}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Companies Tab */}
                {activeTab === 'companies' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Top Recruiters</div>
                      {selectedBranches.map(branch => (
                        <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                          {branch}
                        </div>
                      ))}
                    </div>
                    
                    {[0, 1, 2, 3, 4, 5].map(index => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">
                          #{index + 1}
                        </div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            {branches[branch].companies[index] || '-'}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Generate Detailed Report
                <FiChevronRight className="ml-1" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BranchComparison;