import React, { useState } from 'react';

const LeaveRequestForm = ({ onSubmit, employeeName }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill in all fields');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate > endDate) {
      alert('Start date cannot be after end date');
      return;
    }

    // Generate selected dates (excluding Sundays)
    const selectedDates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip Sundays (0 = Sunday)
      if (currentDate.getDay() !== 0) {
        selectedDates.push(new Date(currentDate).toDateString());
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const newRequest = {
      id: Date.now(),
      employeeName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedDates,
      reason: formData.reason,
      status: 'pending',
      approvedDates: [],
      rejectedDates: [],
      forcefulLeaveRequested: false,
      submittedAt: new Date().toISOString()
    };

    onSubmit(newRequest);
    
    // Reset form
    setFormData({
      startDate: '',
      endDate: '',
      reason: ''
    });

    alert('Leave request submitted successfully!');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Request Leave</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason for Leave
          </label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Please provide a reason for your leave request..."
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Request
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                • Sundays are automatically excluded from leave requests<br/>
                • You can request forceful leave for rejected dates after admin review<br/>
                • Forceful leave will result in salary deduction for those days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
