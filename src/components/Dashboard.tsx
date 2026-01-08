import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Target,
  Calendar
} from 'lucide-react';
import { donorApi, donationApi, campaignApi, taskApi } from '../utils/api';

export function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [donorsRes, donationsRes, campaignsRes, tasksRes] = await Promise.all([
          donorApi.list({ limit: 100 }),
          donationApi.list({ limit: 100 }),
          campaignApi.list({ limit: 100 }),
          taskApi.list({ limit: 100, completed: false })
        ]);
        
        setDonors(donorsRes.donors || []);
        setDonations(donationsRes.donations || []);
        setCampaigns(campaignsRes.campaigns || []);
        setTasks(tasksRes.tasks || []);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate metrics
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const thisMonthDonations = donations.filter((d: any) => {
    const donationDate = new Date(d.date);
    return (
      donationDate.getMonth() === currentMonth &&
      donationDate.getFullYear() === currentYear
    );
  });

  const totalRaisedThisMonth = thisMonthDonations.reduce(
    (sum: number, d: any) => sum + d.amount,
    0
  );

  const newDonors = donors.filter((d: any) => d.status === 'new');
  const lapsedDonors = donors.filter((d: any) => d.status === 'lapsed');
  
  const activeCampaign = campaigns.find((c: any) => c.status === 'active');
  const campaignProgress = activeCampaign
    ? (activeCampaign.raised / activeCampaign.goal) * 100
    : 0;

  const upcomingTasks = tasks
    .filter((t: any) => !t.completed)
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentDonations = [...donations]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading dashboard data...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">Error loading dashboard: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">This Month</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${totalRaisedThisMonth.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {thisMonthDonations.length} donations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">Campaign</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(campaignProgress)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {activeCampaign ? activeCampaign.name : 'No active campaign'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">New</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{newDonors.length}</div>
          <p className="text-sm text-gray-600 mt-1">New donors</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">Attention</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{lapsedDonors.length}</div>
          <p className="text-sm text-gray-600 mt-1">Lapsed donors</p>
        </div>
      </div>

      {/* Campaign Progress */}
      {activeCampaign && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeCampaign.name}
              </h2>
              <p className="text-sm text-gray-600">{activeCampaign.description}</p>
            </div>
            <Link
              to={`/campaigns/${activeCampaign.id}`}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
            >
              View Details
            </Link>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">
                ${activeCampaign.raised.toLocaleString()} raised
              </span>
              <span className="text-gray-900 font-medium">
                Goal: ${activeCampaign.goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(campaignProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/donors/${donation.donorId}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {donation.donorName}
                  </Link>
                  <span className="font-bold text-green-600">
                    ${donation.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(donation.date).toLocaleDateString()}
                  </span>
                  {donation.campaignName && (
                    <span className="text-blue-600">{donation.campaignName}</span>
                  )}
                  {donation.recurring && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/donors"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All Donors
            </Link>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.description}</p>
                    <Link
                      to={`/donors/${task.donorId}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {task.donorName}
                    </Link>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/tasks"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All Tasks
            </Link>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
