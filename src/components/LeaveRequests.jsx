import React, { useState } from 'react';

const LeaveRequests = ({ leaveRequests, onUpdateRequest }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApproveReject = (requestId, dateString, action) => {
    const request = leaveRequests.find(req => req.id === requestId);
    if (!request) return;

    const updatedRequest = { ...request };

    if (action === 'approve') {
      updatedRequest.approvedDates = [...(updatedRequest.approvedDates || []), dateString];
      updatedRequest.rejectedDates = (updatedRequest.rejectedDates || []).filter(date => date !== dateString);
    } else {
      updatedRequest.rejectedDates = [...(updatedRequest.rejectedDates || []), dateString];
      updatedRequest.approvedDates = (updatedRequest.approvedDates || []).filter(date => date !== dateString);
    }

    // Update overall status
    const totalDates = updatedRequest.selectedDates.length;
    const approvedCount = updatedRequest.approvedDates.length;
    const rejectedCount = updatedRequest.rejectedDates.length;

    if (approvedCount + rejectedCount === totalDates) {
      if (rejectedCount === 0) {
        updatedRequest.status = 'approved';
      } else if (approvedCount === 0) {
        updatedRequest.status = 'rejected';
      } else {
        updatedRequest.status = 'partially_approved';
      }
    } else {
      updatedRequest.status = 'pending';
    }

    onUpdateRequest(requestId, updatedRequest);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      partially_approved: 'bg-blue-100 text-blue-800'
    };

    const statusText = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      partially_approved: 'Partially Approved'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Leave Requests</h2>
        
        {leaveRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leave requests found.</p>
        ) : (
          <div className="space-y-6">
            {leaveRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {request.employeeName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status)}
                    {request.forcefulLeaveRequested && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Forceful Leave Requested
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requested Dates:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {request.selectedDates.map((dateString, index) => {
                      const isApproved = request.approvedDates?.includes(dateString);
                      const isRejected = request.rejectedDates?.includes(dateString);
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded border text-sm ${
                            isApproved
                              ? 'bg-green-50 border-green-200'
                              : isRejected
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="font-medium">{formatDate(dateString)}</div>
                          <div className="mt-1 space-x-1">
                            {!isApproved && !isRejected && (
                              <>
                                <button
                                  onClick={() => handleApproveReject(request.id, dateString, 'approve')}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleApproveReject(request.id, dateString, 'reject')}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {isApproved && (
                              <>
                                <span className="text-xs text-green-600 font-medium">Approved</span>
                                <button
                                  onClick={() => handleApproveReject(request.id, dateString, 'reject')}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 ml-1"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {isRejected && (
                              <>
                                <span className="text-xs text-red-600 font-medium">Rejected</span>
                                <button
                                  onClick={() => handleApproveReject(request.id, dateString, 'approve')}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 ml-1"
                                >
                                  Approve
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {request.forcefulLeaveRequested && request.rejectedDates?.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                    <h4 className="text-sm font-medium text-orange-900">Forceful Leave Notice</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Employee has requested forceful leave for rejected dates. Salary will be deducted for these days:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {request.rejectedDates.map((date, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
