import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import LeaveRequests from './LeaveRequests';
import EmployeeManagement from './EmployeeManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (userRole !== 'admin' || username !== 'admin') {
      navigate('/login');
    }

    // Load leave requests from localStorage
    const savedRequests = localStorage.getItem('leaveRequests');
    if (savedRequests) {
      setLeaveRequests(JSON.parse(savedRequests));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const updateLeaveRequest = (requestId, updatedRequest) => {
    const updatedRequests = leaveRequests.map(req => 
      req.id === requestId ? updatedRequest : req
    );
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-4 text-sm text-gray-600">Welcome, Administrator</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Management
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Calendar
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Requests
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'employees' && (
            <EmployeeManagement />
          )}
          {activeTab === 'calendar' && (
            <Calendar
              userRole="admin"
              leaveRequests={leaveRequests}
              onUpdateRequest={updateLeaveRequest}
            />
          )}
          {activeTab === 'requests' && (
            <LeaveRequests
              leaveRequests={leaveRequests}
              onUpdateRequest={updateLeaveRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
