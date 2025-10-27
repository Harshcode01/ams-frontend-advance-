import React, { useState, useEffect } from 'react';

const Calendar = ({ userRole, leaveRequests, currentUser, onUpdateRequest }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Get unique employees for admin view
  const employees = [...new Set(leaveRequests.map(req => req.employeeName))];

  useEffect(() => {
    if (userRole === 'admin' && employees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(employees[0]);
    }
  }, [employees, selectedEmployee, userRole]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDayStatus = (day) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    const targetEmployee = userRole === 'admin' ? selectedEmployee : currentUser;
    
    // Find leave requests for the target employee
    const employeeRequests = leaveRequests.filter(req => req.employeeName === targetEmployee);
    
    for (const request of employeeRequests) {
      if (request.selectedDates.includes(dateString)) {
        if (request.approvedDates?.includes(dateString)) {
          return 'approved';
        } else if (request.rejectedDates?.includes(dateString)) {
          return 'rejected';
        } else {
          return 'pending';
        }
      }
    }
    
    return 'normal';
  };

  const handleForcefulLeave = (requestId) => {
    const request = leaveRequests.find(req => req.id === requestId);
    if (!request) return;

    const updatedRequest = {
      ...request,
      forcefulLeaveRequested: true,
      status: 'forceful_leave'
    };

    onUpdateRequest(requestId, updatedRequest);
    alert('Forceful leave request submitted. Salary will be deducted for rejected days.');
  };

  const getDayClassName = (day, status) => {
    const baseClasses = 'h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer';
    const today = new Date();
    const isToday = 
      today.getDate() === day && 
      today.getMonth() === currentDate.getMonth() && 
      today.getFullYear() === currentDate.getFullYear();

    const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
    const isSunday = dayOfWeek === 0;

    if (isSunday) {
      return `${baseClasses} bg-gray-100 text-gray-400`;
    }

    switch (status) {
      case 'pending':
        return `${baseClasses} bg-red-200 text-red-800 border-2 border-red-300`;
      case 'approved':
        return `${baseClasses} bg-red-500 text-white`;
      case 'rejected':
        return `${baseClasses} bg-green-200 text-green-800`;
      default:
        if (isToday) {
          return `${baseClasses} bg-blue-500 text-white`;
        }
        return `${baseClasses} hover:bg-gray-100`;
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDayStatus(day);
      days.push(
        <div key={day} className={getDayClassName(day, status)}>
          {day}
        </div>
      );
    }

    return days;
  };

  const getEmployeeRequestsWithRejectedDates = () => {
    const targetEmployee = userRole === 'admin' ? selectedEmployee : currentUser;
    return leaveRequests.filter(req => 
      req.employeeName === targetEmployee && 
      req.rejectedDates?.length > 0 && 
      !req.forcefulLeaveRequested
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {userRole === 'admin' ? 'Employee Calendar' : 'My Calendar'}
        </h2>
        
        {userRole === 'admin' && employees.length > 0 && (
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900">
          {getMonthName(currentDate)}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Approved Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded-full mr-2"></div>
            <span>Rejected Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded-full mr-2"></div>
            <span>Pending Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 rounded-full mr-2"></div>
            <span>Sunday (Excluded)</span>
          </div>
        </div>
      </div>

      {/* Forceful Leave Section for Employees */}
      {userRole === 'employee' && getEmployeeRequestsWithRejectedDates().length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Forceful Leave Options</h4>
          <p className="text-sm text-gray-600 mb-4">
            You have some rejected leave dates. You can request forceful leave for these days, 
            but your salary will be deducted accordingly.
          </p>
          
          {getEmployeeRequestsWithRejectedDates().map((request) => (
            <div key={request.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Leave Request: {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Reason: {request.reason}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Rejected dates: {request.rejectedDates.map(date => new Date(date).toLocaleDateString()).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => handleForcefulLeave(request.id)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
                >
                  Request Forceful Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
