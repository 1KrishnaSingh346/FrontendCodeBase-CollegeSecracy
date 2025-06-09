import { useEffect, useState } from 'react';
import { FiDollarSign, FiUsers, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import Chart from 'react-apexcharts';

const AdminPaymentAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyRevenue: [],
    planDistribution: []
  });
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // In a real app, you would fetch this from your API
      const mockData = {
        totalRevenue: 125000,
        activeSubscriptions: 342,
        monthlyRevenue: [
          { month: 'Jan', revenue: 25000 },
          { month: 'Feb', revenue: 32000 },
          { month: 'Mar', revenue: 28000 },
          { month: 'Apr', revenue: 40000 }
        ],
        planDistribution: [
          { name: 'Premium', value: 45 },
          { name: 'JOSAA', value: 25 },
          { name: 'UPTAC', value: 15 },
          { name: 'Tools', value: 15 }
        ]
      };
      setStats(mockData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: stats.monthlyRevenue.map(item => item.month)
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`
      }
    }
  };

  const revenueChartSeries = [{
    name: 'Revenue',
    data: stats.monthlyRevenue.map(item => item.revenue)
  }];

  const planDistributionOptions = {
    chart: {
      type: 'donut',
    },
    labels: stats.planDistribution.map(item => item.name),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    }
  };

  const planDistributionSeries = stats.planDistribution.map(item => item.value);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Payment Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiDollarSign size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiUsers size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-xl font-bold">{stats.activeSubscriptions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Revenue/User</p>
              <p className="text-xl font-bold">₹{(stats.totalRevenue / stats.activeSubscriptions || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiPieChart size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold">12.5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Revenue Trend</h3>
          <Chart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="area"
            height={350}
          />
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Plan Distribution</h3>
          <Chart
            options={planDistributionOptions}
            series={planDistributionSeries}
            type="donut"
            height={350}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">user{item}@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">Premium Membership</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">₹299</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">2023-05-{10 + item}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentAnalytics;