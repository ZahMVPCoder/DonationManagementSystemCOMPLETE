import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, DollarSign, Calendar } from 'lucide-react';
import { donorApi } from '../utils/api';

type DonorStatus = 'active' | 'new' | 'lapsed';

export function DonorList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const result = await donorApi.list({
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit: 50
        });
        setDonors(result.donors || []);
      } catch (err: any) {
        console.error('Failed to fetch donors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: DonorStatus) => {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your donor relationships
          </p>
        </div>
        <Link
          to="/donors/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Donor
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="new">New</option>
              <option value="lapsed">Lapsed</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading donors...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">Error loading donors: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {donors.length} donors
            </p>
          </div>

          {!donors.length && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No donors found. Create your first donor to get started!</p>
            </div>
          )}

          {/* Donor Cards */}
          <div className="grid grid-cols-1 gap-4">
            {donors.map((donor: any) => (
              <Link
                key={donor.id}
                to={`/donors/${donor.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          donor.status
                        )}`}
                      >
                        {donor.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                      <p>{donor.email}</p>
                      {donor.phone && <p>{donor.phone}</p>}
                    </div>
                    {donor.notes && (
                      <p className="text-sm text-gray-700 mb-4">{donor.notes}</p>
                    )}
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      Donor #{donor.id.substring(0, 8)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Since {new Date(donor.createdAt).toLocaleDateString()}</p>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
