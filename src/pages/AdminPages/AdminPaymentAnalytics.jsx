import { useEffect, useState, lazy, Suspense } from 'react';
import { 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp, 
  FiPieChart,
  FiCalendar, 
  FiFilter,
  FiFile,
  FiFileText
} from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore.js';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentPDFDocument from './components/PaymentPDFDocument.jsx';
import { exportPaymentsToExcel } from './utils/exportPaymentsToExcel.js';

// Dynamically import ApexCharts with lazy loading
const Chart = lazy(() => import('react-apexcharts'));

const AdminPaymentAnalytics = () => {
  const { payments, getAllPayments } = useAuthStore();
  const [theme, setTheme] = useState(typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalTransactions: 0,
    failedTransactions: 0,
    monthlyRevenue: [],
    weeklyRevenue: [],
    dailyRevenue: [],
    planDistribution: [],
  });

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    getAllPayments();
  }, []);

  useEffect(() => {
    if (payments && payments.length > 0) {
      applyFilters();
    }
  }, [payments, searchQuery, statusFilter, dateRangeFilter, startDate, endDate]);

  const applyFilters = () => {
    let filtered = payments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (dateRangeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.createdAt || p.boughtAt);
        
        switch (dateRangeFilter) {
          case 'today':
            return isSameDay(paymentDate, now);
          case 'week':
            return isSameWeek(paymentDate, now);
          case 'month':
            return isSameMonth(paymentDate, now);
          case 'year':
            return isSameYear(paymentDate, now);
          case 'custom':
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              return paymentDate >= start && paymentDate <= end;
            }
            return true;
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
    calculateStats(filtered);
  };

  // Date comparison helpers
  const isSameDay = (date1, date2) => (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );

  const isSameWeek = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays <= 7 && date1.getMonth() === date2.getMonth();
  };

  const isSameMonth = (date1, date2) => (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );

  const isSameYear = (date1, date2) => (
    date1.getFullYear() === date2.getFullYear()
  );

  const calculateStats = (data) => {
    const totalRevenue = data.reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeSubscriptions = data.filter((p) => p.status === 'paid').length;
    const totalTransactions = data.length;
    const failedTransactions = data.filter((p) => p.status === 'failed').length;

    // Monthly Revenue with sorting
    const monthlyMap = {};
    data.forEach((p) => {
      const date = new Date(p.createdAt || p.boughtAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + (p.amount || 0);

    });
    
const monthlyRevenue = Object.entries(monthlyMap)
  .map(([key, revenue]) => {
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month - 1); // recreate from safe format
    return {
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      revenue,
      date
    };
  })
  .sort((a, b) => a.date - b.date)
  .map(({ month, revenue }) => ({ month, revenue }));


    // Weekly Revenue
    const weeklyMap = {};
    data.forEach((p) => {
      const date = new Date(p.createdAt || p.boughtAt);
      const week = `Week ${getWeekNumber(date)}, ${date.getFullYear()}`;
      weeklyMap[week] = (weeklyMap[week] || 0) + (p.amount || 0);
    });
    const weeklyRevenue = Object.entries(weeklyMap).map(([week, revenue]) => ({
      week,
      revenue,
    }));

    // Daily Revenue (last 30 days)
    const dailyMap = {};
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));
    
data.forEach((p) => {
  const date = new Date(p.createdAt || p.boughtAt);
  if (date >= last30Days) {
    const localDay = date.toLocaleDateString('en-CA');
    dailyMap[localDay] = (dailyMap[localDay] || 0) + (p.amount || 0);
  }
});

const dailyRevenue = Object.entries(dailyMap)
  .map(([day, revenue]) => ({
    day,
    revenue,
    date: new Date(day)
  }))
  .sort((a, b) => a.date - b.date)
  .map(({ day, revenue }) => ({ day, revenue }));



    // Plan Distribution
    const planMap = {};
    data.forEach((p) => {
      const plan = p.PlanName || p.plan || 'Unknown';
      planMap[plan] = (planMap[plan] || 0) + 1;
    });
    const planDistribution = Object.entries(planMap).map(([name, value]) => ({
      name,
      value,
    }));

    setStats({
      totalRevenue,
      activeSubscriptions,
      totalTransactions,
      failedTransactions,
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
      planDistribution,
    });
  };

const getWeekNumber = (date) => {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7; // Sunday = 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum); // Set to nearest Thursday
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
  return weekNo;
};


  // Theme-aware chart colors
  const chartColors = {
    light: {
      text: '#6B7280',
      background: '#ffffff',
      grid: '#E5E7EB',
      primary: '#4F46E5',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      chartBg: '#ffffff',
      chartText: '#111827',
      chartGrid: '#E5E7EB'
    },
    dark: {
      text: '#9CA3AF',
      background: '#1F2937',
      grid: '#374151',
      primary: '#818CF8',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      chartBg: '#1F2937',
      chartText: '#F3F4F6',
      chartGrid: '#374151'
    }
  };

  const currentColors = chartColors[theme] || chartColors.light;

  const getBarChartOptions = () => ({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      background: currentColors.chartBg,
      foreColor: currentColors.chartText,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: [currentColors.primary],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: stats?.monthlyRevenue?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: currentColors.chartText,
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true,
        color: currentColors.chartGrid
      },
      axisTicks: {
        show: true,
        color: currentColors.chartGrid
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val.toLocaleString()}`,
        style: {
          colors: currentColors.chartText,
          fontSize: '12px'
        }
      },
      min: 0
    },
    tooltip: {
      enabled: true,
      theme: theme,
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`
      }
    },
    grid: {
      borderColor: currentColors.chartGrid,
      strokeDashArray: 4
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        xaxis: {
          labels: {
            rotate: -45,
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }]
  });

const getDailyBarChartOptions = () => ({
  ...getBarChartOptions(),
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: val => new Date(val).toLocaleDateString('en-IN'), // 👈 fix timezone view
      style: {
        colors: currentColors.chartText,
        fontSize: '12px'
      }
    },
    axisBorder: {
      show: true,
      color: currentColors.chartGrid
    },
    axisTicks: {
      show: true,
      color: currentColors.chartGrid
    }
  },
  tooltip: {
    theme,
    x: {
      formatter: val => new Date(val).toLocaleDateString('en-IN') // 👈 fix tooltip confusion
    },
    y: {
      formatter: val => `₹${val.toLocaleString()}`
    }
  }
});


  const revenueChartSeries = [{
    name: 'Revenue',
    data: stats.monthlyRevenue.map((item) => item.revenue),
  }];

  const dailyRevenueSeries = [{
    name: 'Daily Revenue',
    data: stats.dailyRevenue.map(item => ({
      x: new Date(item.day).getTime(),
      y: item.revenue
    }))
  }];

  const planDistributionOptions = {
    chart: {
      type: 'donut',
      height: 350,
      background: currentColors.chartBg,
      foreColor: currentColors.chartText
    },
    labels: stats.planDistribution.map((item) => item.name),
    colors: [
      currentColors.primary,
      currentColors.success,
      currentColors.warning,
      currentColors.danger,
      '#8B5CF6',
      '#EC4899'
    ],
    legend: {
      position: 'bottom',
      labels: {
        colors: currentColors.chartText,
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [currentColors.chartBg],
        fontSize: '12px'
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              color: currentColors.chartText
            },
            value: {
              show: true,
              fontSize: '16px',
              color: currentColors.chartText,
              formatter: (val) => `${val}`
            },
            total: {
              show: true,
              label: 'Total',
              color: currentColors.chartText,
              formatter: () => stats.planDistribution.reduce((sum, item) => sum + item.value, 0)
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom',
          fontSize: '10px'
        }
      }
    }]
  };

  const planDistributionSeries = stats.planDistribution.map((item) => item.value);

  const statusColors = {
    light: {
      created: 'bg-blue-100 text-blue-800',
      attempted: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    },
    dark: {
      created: 'bg-blue-900 text-blue-200',
      attempted: 'bg-yellow-900 text-yellow-200',
      paid: 'bg-green-900 text-green-200',
      failed: 'bg-red-900 text-red-200',
      refunded: 'bg-purple-900 text-purple-200'
    }
  };

  const getStatusColor = (status) => 
    statusColors[theme][status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  // Loading component for Suspense fallback
  const ChartLoading = () => (
    <div className={`flex items-center justify-center h-64 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
      Loading charts...
    </div>
  );

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with export buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Payment Analytics Dashboard</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            
            {/* Export Buttons Group */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => exportPaymentsToExcel(filteredPayments)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 md:flex-none ${
                  theme === 'dark' 
                    ? 'bg-green-700 hover:bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <FiFile size={18} />
                <span className="whitespace-nowrap">Export Excel</span>
              </button>
              
              <PDFDownloadLink
                document={<PaymentPDFDocument payments={filteredPayments} stats={stats} />}
                fileName={`payment_report_${new Date().toISOString().slice(0, 10)}.pdf`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 md:flex-none ${
                  theme === 'dark' 
                    ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {({ loading }) => (
                  <>
                    <FiFileText size={18} />
                    <span className="whitespace-nowrap">
                      {loading ? 'Preparing PDF...' : 'Export PDF'}
                    </span>
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-lg shadow mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="created">Created</option>
                <option value="attempted">Attempted</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRangeFilter === 'custom' && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { 
              title: 'Total Revenue', 
              value: `₹${stats.totalRevenue.toLocaleString()}`, 
              subtitle: 'All time', 
              icon: <FiDollarSign size={24} />,
              bg: 'bg-indigo-100 dark:bg-indigo-900',
              text: 'text-indigo-600 dark:text-indigo-300'
            },
            { 
              title: 'Active Subscriptions', 
              value: stats.activeSubscriptions.toLocaleString(), 
              subtitle: 'Paid plans', 
              icon: <FiUsers size={24} />,
              bg: 'bg-green-100 dark:bg-green-900',
              text: 'text-green-600 dark:text-green-300'
            },
            { 
              title: 'Total Transactions', 
              value: stats.totalTransactions.toLocaleString(), 
              subtitle: 'All payments', 
              icon: <FiTrendingUp size={24} />,
              bg: 'bg-blue-100 dark:bg-blue-900',
              text: 'text-blue-600 dark:text-blue-300'
            },
            { 
              title: 'Failed Transactions', 
              value: stats.failedTransactions.toLocaleString(), 
              subtitle: 'Requires attention', 
              icon: <FiPieChart size={24} />,
              bg: 'bg-red-100 dark:bg-red-900',
              text: 'text-red-600 dark:text-red-300'
            }
          ].map((card, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {card.title}
                  </p>
                  <p className="text-xl md:text-2xl font-semibold mt-1">
                    {card.value}
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-full ${card.bg} ${card.text}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Revenue Bar Chart */}
          <div className={`p-4 md:p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
            {stats.monthlyRevenue.length > 0 ? (
              <div className="w-full overflow-x-auto scrollbar-hide">
                <Suspense fallback={<ChartLoading />}>
                  <Chart
                    options={getBarChartOptions()}
                    series={revenueChartSeries}
                    type="bar"
                    height={350}
                    width="100%"
                  />
                </Suspense>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-64 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No revenue data available
              </div>
            )}
          </div>

          {/* Plan Distribution Donut Chart */}
          <div className={`p-4 md:p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-4">Plan Distribution</h3>
            {stats.planDistribution.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <Suspense fallback={<ChartLoading />}>
                  <Chart
                    options={planDistributionOptions}
                    series={planDistributionSeries}
                    type="donut"
                    height={350}
                    width="100%"
                  />
                </Suspense>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-64 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No plan distribution data available
              </div>
            )}
          </div>
        </div>

        {/* Daily Revenue Bar Chart */}
        <div className={`p-4 md:p-6 rounded-lg shadow mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-medium mb-4">Daily Revenue (Last 30 Days)</h3>
          {stats.dailyRevenue.length > 0 ? (
            <div className="w-full overflow-x-auto scrollbar-hide">
              <Suspense fallback={<ChartLoading />}>
                <Chart
                  options={getDailyBarChartOptions()}
                  series={dailyRevenueSeries}
                  type="bar"
                  height={350}
                  width="100%"
                />
              </Suspense>
            </div>
          ) : (
            <div className={`flex items-center justify-center h-64 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No daily revenue data available
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className={`rounded-lg shadow overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`px-4 md:px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="text-lg font-medium">Recent Transactions</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {filteredPayments.length} transactions found
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    {['User', 'Plan', 'Amount', 'Date', 'Status', 'Transaction ID'].map((header) => (
                      <th 
                        key={header}
                        scope="col" 
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      >
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                          {header}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr 
                        key={payment._id} 
                        className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                      >
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-2 md:ml-4">
                              <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {payment.userId?.email || payment.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            {payment.PlanName || payment.plan || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            ₹{payment.amount?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            {new Date(payment.createdAt || payment.boughtAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {payment.transactionId || payment.paymentId || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={`px-6 py-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentAnalytics;