import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DollarSign, CheckCircle } from 'lucide-react';
import { mockDonors, mockCampaigns } from '../data/mockData';

export function DonationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDonorId = searchParams.get('donorId');

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    donorId: preselectedDonorId || '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'credit_card' as 'credit_card' | 'check' | 'cash' | 'bank_transfer',
    campaignId: '',
    recurring: false,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock save - replace with your Prisma API call
    // POST /api/donations
    console.log('Saving donation:', formData);

    // Show success message (triggers thank-you workflow)
    setShowSuccess(true);

    // Redirect after delay
    setTimeout(() => {
      if (formData.donorId) {
        navigate(`/donors/${formData.donorId}`);
      } else {
        navigate('/donors');
      }
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const selectedDonor = mockDonors.find((d) => d.id === formData.donorId);

  if (showSuccess) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Donation Recorded Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank-you workflow has been triggered for {selectedDonor?.name}.
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Log a Donation</h1>
          <p className="text-gray-600 mt-2">
            Record a new donation and trigger thank-you workflow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Donor Selection */}
            <div>
              <label htmlFor="donorId" className="block text-sm font-medium text-gray-700 mb-2">
                Donor <span className="text-red-500">*</span>
              </label>
              <select
                id="donorId"
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select a donor...</option>
                {mockDonors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name} ({donor.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                id="method"
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="credit_card">Credit Card</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Campaign */}
            <div>
              <label htmlFor="campaignId" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign (Optional)
              </label>
              <select
                id="campaignId"
                name="campaignId"
                value={formData.campaignId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">No campaign</option>
                {mockCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurring */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="recurring" className="ml-3 text-sm font-medium text-gray-700">
                This is a recurring donation
              </label>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Add any relevant notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <DollarSign className="w-5 h-5" />
              Record Donation
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Thank-you Workflow:</strong> Upon submission, this will automatically
              trigger a thank-you task for the selected donor.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
