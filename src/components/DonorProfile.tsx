import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { donorApi, donationApi, taskApi } from '../utils/api';

export function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState<any>(null);
  const [donations, setDonations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDonorData();
    }
  }, [id]);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const [donorData, donationsData, tasksData] = await Promise.all([
        donorApi.get(id!),
        donationApi.list({ donorId: id, limit: 50 }),
        taskApi.list({ donorId: id, limit: 50 })
      ]);
      
      setDonor(donorData);
      setDonations(donationsData.donations || []);
      setTasks(tasksData.tasks || []);
    } catch (err: any) {
      console.error('Failed to fetch donor data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading donor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">{error || 'Donor not found'}</p>
          <Link to="/donors" className="text-blue-600 hover:text-blue-700 font-medium">
            Return to Donors List
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: typeof donor.status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'lapsed':
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/donors')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Donors
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{donor.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  donor.status
                )}`}
              >
                {donor.status}
              </span>
            </div>
            <p className="text-gray-600">
              Donor since {new Date(donor.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/donations/new?donorId=${donor.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              Log Donation
            </Link>
            <Link
              to={`/donors/${donor.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-5 h-5" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Donor Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${donor.email}`} className="hover:text-blue-600">
                  {donor.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${donor.phone}`} className="hover:text-blue-600">
                  {donor.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Giving Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Giving Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Giving</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${donor.totalGiving.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Donations</p>
                <p className="text-xl font-bold text-gray-900">
                  {donor.donationCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Gift</p>
                <p className="text-xl font-bold text-gray-900">
                  ${Math.round(donor.totalGiving / donor.donationCount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Gift</p>
                <p className="font-medium text-gray-900">
                  ${donor.lastGiftAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(donor.lastGiftDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700">{donor.notes}</p>
          </div>
        </div>

        {/* Right Column - History & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Donation History</h2>
            </div>
            {donations.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {donations.map((donation) => (
                  <div key={donation.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${donation.amount.toLocaleString()}
                          </span>
                          {donation.recurring && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(donation.date).toLocaleDateString()}
                          </span>
                          <span className="capitalize">{donation.method.replace('_', ' ')}</span>
                          {donation.campaignName && (
                            <span className="text-blue-600">{donation.campaignName}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {donation.thanked ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Thanked
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-600 text-sm">
                            <XCircle className="w-4 h-4" />
                            Needs Thank You
                          </span>
                        )}
                      </div>
                    </div>
                    {donation.notes && (
                      <p className="text-sm text-gray-700">{donation.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">
                No donations recorded yet
              </div>
            )}
          </div>

          {/* Tasks & Follow-ups */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Tasks & Follow-ups</h2>
            </div>
            {tasks.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          <span className="capitalize">{task.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">
                No tasks assigned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
