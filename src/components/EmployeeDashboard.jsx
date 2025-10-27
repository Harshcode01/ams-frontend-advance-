import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import LeaveRequestForm from './LeaveRequestForm';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is employee
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    const employeeId = localStorage.getItem('employeeId');
    
    if (userRole !== 'employee') {
      navigate('/login');
      return;
    }

    // Get employee information
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees && employeeId) {
      const employees = JSON.parse(savedEmployees);
      const employee = employees.find(emp => emp.id === parseInt(employeeId));
      if (employee && employee.isActive) {
        setEmployeeInfo(employee);
        setCurrentUser(employee.username);
      } else {
        // Employee not found or inactive
        localStorage.clear();
        navigate('/login');
        return;
      }
    } else {
      localStorage.clear();
      navigate('/login');
      return;
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

  const addLeaveRequest = (newRequest) => {
    const updatedRequests = [...leaveRequests, newRequest];
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
  };

  const updateLeaveRequest = (requestId, updatedRequest) => {
    const updatedRequests = leaveRequests.map(req => 
      req.id === requestId ? updatedRequest : req
    );
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
  };

  // Filter requests for current employee
  const employeeRequests = leaveRequests.filter(req => req.employeeName === currentUser);

  if (!employeeInfo) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <div className="ml-4 text-sm text-gray-600">
                <div>Welcome, {employeeInfo.name}</div>
                <div>{employeeInfo.department && `${employeeInfo.department} - ${employeeInfo.position || 'Employee'}`}</div>
              </div>
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
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Calendar
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'request'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Request Leave
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'calendar' && (
            <Calendar
              userRole="employee"
              leaveRequests={employeeRequests}
              currentUser={currentUser}
              onUpdateRequest={updateLeaveRequest}
            />
          )}
          {activeTab === 'request' && (
            <LeaveRequestForm
              onSubmit={addLeaveRequest}
              employeeName={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
