import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, DollarSign, Target, TrendingUp } from 'lucide-react';
import { campaignApi, donationApi } from '../utils/api';

export function CampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        if (!id) {
          setError('Campaign ID not found');
          return;
        }

        const [campaignRes, donationsRes] = await Promise.all([
          campaignApi.get(id),
          donationApi.list({ campaignId: id }),
        ]);

        setCampaign(campaignRes.data);
        setDonations(donationsRes.data.donations || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">{error || 'Campaign not found'}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const progress = (campaign.totalRaised / campaign.goalAmount) * 100;
  const remaining = campaign.goalAmount - campaign.totalRaised;
  const donorCount = new Set(donations.map((d) => d.donorId)).size;
  const averageDonation =
    donations.length > 0
      ? campaign.totalRaised / donations.length
      : 0;

  const getStatusColor = (status: typeof campaign.status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>
            </div>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Raised</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${campaign.raised.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Goal</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${campaign.goalAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Donors</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{donorCount}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Avg. Gift</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${Math.round(averageDonation).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Campaign Progress</h2>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-gray-600">
            {remaining > 0
              ? `$${remaining.toLocaleString()} remaining to reach goal`
              : 'Goal exceeded!'}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(campaign.startDate).toLocaleDateString()} -{' '}
            {new Date(campaign.endDate).toLocaleDateString()}
          </span>
          <span>{donations.length} donations</span>
        </div>
      </div>

      {/* Campaign Donations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Campaign Donations</h2>
        </div>
        {donations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <div key={donation.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/donors/${donation.donorId}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {donation.donorId}
                  </Link>
                  <span className="text-xl font-bold text-green-600">
                    ${donation.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(donation.donatedAt).toLocaleDateString()}
                  </span>
                  <span className="capitalize">
                    {donation.paymentMethod?.replace('_', ' ')}
                  </span>
                </div>
                {donation.notes && (
                  <p className="text-sm text-gray-700 mt-2">{donation.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-600">
            No donations recorded for this campaign yet
          </div>
        )}
      </div>
    </div>
  );
}
