import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, DollarSign, Calendar } from 'lucide-react';
import { mockDonors, Donor } from '../data/mockData';

export function DonorList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDonors = mockDonors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' || donor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Donor['status']) => {
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

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredDonors.length} of {mockDonors.length} donors
        </p>
      </div>

      {/* Donor Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDonors.map((donor) => (
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
                  <p>{donor.phone}</p>
                </div>
                {donor.notes && (
                  <p className="text-sm text-gray-700 mb-4">{donor.notes}</p>
                )}
              </div>

              <div className="text-right ml-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${donor.totalGiving.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-3">Total Giving</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Last: ${donor.lastGiftAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {new Date(donor.lastGiftDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No donors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
