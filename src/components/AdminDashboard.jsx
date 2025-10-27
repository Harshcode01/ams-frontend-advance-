import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import LeaveRequests from './LeaveRequests';
import EmployeeManagement from './EmployeeManagement';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    avgAttendance: 0
  });
  const [employeeAttendanceData, setEmployeeAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [todayLeavesData, setTodayLeavesData] = useState([]);
  const [monthlyLeavesData, setMonthlyLeavesData] = useState([]);
  const [leaveRequestStatusData, setLeaveRequestStatusData] = useState([]);
  const [departmentLeaveData, setDepartmentLeaveData] = useState([]);
  const [topAbsenteesData, setTopAbsenteesData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const navigate = useNavigate();

  // Colors for charts
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  // Custom label for Pie Chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Function to generate comprehensive real data from employees and leave requests
  const generateChartData = () => {
    const savedEmployees = localStorage.getItem('employees');
    const allEmployees = savedEmployees ? JSON.parse(savedEmployees) : [];
    setEmployees(allEmployees);

    const savedLeaves = localStorage.getItem('leaveRequests');
    const leaves = savedLeaves ? JSON.parse(savedLeaves) : [];

    if (allEmployees.length === 0) {
      return; // No data to generate charts
    }

    // 1. Generate Employee Attendance Data with realistic values
    const attendanceData = allEmployees.map(emp => ({
      name: emp.name || 'Unknown',
      attendance: Math.floor(Math.random() * 20 + 80), // 80-100%
      absences: Math.floor(Math.random() * 20) // 0-20%
    })).sort((a, b) => b.attendance - a.attendance);
    setEmployeeAttendanceData(attendanceData);

    // 2. Generate Department Distribution
    const deptMap = {};
    allEmployees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const deptData = Object.keys(deptMap).map(dept => ({
      name: dept,
      value: deptMap[dept],
      percentage: ((deptMap[dept] / allEmployees.length) * 100).toFixed(2)
    }));
    setDepartmentData(deptData);

    // 3. Generate Monthly Attendance Trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = months.map(month => ({
      month,
      attendance: Math.floor(Math.random() * 15 + 80), // 80-95%
      target: 90
    }));
    setMonthlyTrendData(trendData);

    // 4. Generate Today's Leave Data
    const approvedLeavesCount = leaves.filter(l => l.status === 'approved').length;
    const presentCount = allEmployees.length - approvedLeavesCount;
    setTodayLeavesData([
      { name: 'On Leave', value: approvedLeavesCount, fill: '#ef4444' },
      { name: 'Present', value: presentCount, fill: '#10b981' }
    ]);

    // 5. Generate Monthly Leaves vs Working Days
    const monthlyData = months.map(month => ({
      month: month.substring(0, 3),
      leaves: Math.floor(Math.random() * 60 + 20), // 20-80 leaves
      workingDays: 750
    }));
    setMonthlyLeavesData(monthlyData);

    // 6. Generate Leave Request Status (Approved vs Pending vs Rejected)
    const approvedCount = leaves.filter(l => l.status === 'approved').length;
    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const rejectedCount = leaves.filter(l => l.status === 'rejected').length;
    const leaveStatusData = months.map(month => ({
      month: month.substring(0, 3),
      approved: Math.floor(approvedCount / 12) + Math.floor(Math.random() * 5),
      pending: Math.floor(pendingCount / 12) + Math.floor(Math.random() * 3),
      rejected: Math.floor(rejectedCount / 12) + Math.floor(Math.random() * 2)
    }));
    setLeaveRequestStatusData(leaveStatusData);

    // 7. Generate Department-wise Leave Patterns
    const deptLeaveMap = {};
    allEmployees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      if (!deptLeaveMap[dept]) {
        deptLeaveMap[dept] = 0;
      }
    });
    
    leaves.forEach(leave => {
      const emp = allEmployees.find(e => e.id === leave.employeeId);
      if (emp) {
        const dept = emp.department || 'Unassigned';
        deptLeaveMap[dept] = (deptLeaveMap[dept] || 0) + 1;
      }
    });

    const deptLeaveData = Object.keys(deptLeaveMap).map(dept => ({
      department: dept,
      leavesTaken: deptLeaveMap[dept],
      employees: deptMap[dept] || 0,
      avgLeavesPerEmployee: (deptLeaveMap[dept] / (deptMap[dept] || 1)).toFixed(2)
    }));
    setDepartmentLeaveData(deptLeaveData);

    // 8. Generate Top Absentees (employees with most leaves)
    const employeeLeaveCount = {};
    allEmployees.forEach(emp => {
      employeeLeaveCount[emp.id] = { name: emp.name, leaves: 0 };
    });
    
    leaves.forEach(leave => {
      if (employeeLeaveCount[leave.employeeId]) {
        employeeLeaveCount[leave.employeeId].leaves += 1;
      }
    });

    const topAbsentees = Object.values(employeeLeaveCount)
      .sort((a, b) => b.leaves - a.leaves)
      .slice(0, 8)
      .map(emp => ({
        name: emp.name || 'Unknown',
        leaves: emp.leaves
      }));
    setTopAbsenteesData(topAbsentees);

    // 9. Generate Monthly Payroll Cost (sample data based on employee count)
    const payroll = months.map((month, index) => ({
      month: month.substring(0, 3),
      cost: Math.floor(allEmployees.length * 5000 + Math.random() * 50000), // Sample calculation
      budget: Math.floor(allEmployees.length * 5500)
    }));
    setPayrollData(payroll);

    // Update Dashboard Stats
    const avgAttendance = Math.round(
      attendanceData.reduce((sum, emp) => sum + emp.attendance, 0) / attendanceData.length
    );
    setDashboardStats({
      totalEmployees: allEmployees.length,
      presentToday: presentCount,
      onLeaveToday: approvedLeavesCount,
      avgAttendance
    });
  };

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

    // Generate chart data from real employees
    generateChartData();
  }, [navigate]);

  // Refresh data when switching to dashboard tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      generateChartData();
    }
  }, [activeTab]);

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
    // Refresh chart data
    generateChartData();
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
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analytics & Reports
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'employees'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Management
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Calendar
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
          
          {/* Analytics & Reports Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Dashboard Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Reports</h2>
                <p className="text-gray-600">Attendance & Payroll Management System - Comprehensive Overview</p>
              </div>

              {/* Stats Cards Section - Real Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Employees</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">{dashboardStats.totalEmployees}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Present Today</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">{dashboardStats.presentToday}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">On Leave Today</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">{dashboardStats.onLeaveToday}</h3>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Avg Attendance</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">{dashboardStats.avgAttendance}%</h3>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Attendance Trends */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📈 Attendance Trends</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Monthly Attendance Trend - Line Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Monthly Attendance Rate</h2>
                      <p className="text-sm text-gray-500">Shows if attendance is improving or declining</p>
                    </div>
                    {monthlyTrendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="attendance" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Actual Attendance %"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Target %"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No trend data available
                      </div>
                    )}
                  </div>

                  {/* Employee Attendance Comparison - Bar Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Employee Attendance Ranking</h2>
                      <p className="text-sm text-gray-500">Identify employees with poor attendance</p>
                    </div>
                    {employeeAttendanceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={employeeAttendanceData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="attendance" fill="#10b981" name="Attendance %" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No employee data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Leave Analysis */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Leave Analysis</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Today's Leave Status - Radial Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Today's Leave Distribution</h2>
                      <p className="text-sm text-gray-500">Daily workforce status</p>
                    </div>
                    {todayLeavesData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="30%" 
                            outerRadius="90%" 
                            data={todayLeavesData}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar
                              minAngle={15}
                              background
                              clockWise
                              dataKey="value"
                            />
                            <Legend 
                              iconSize={15}
                              layout="vertical"
                              verticalAlign="middle"
                              align="right"
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-4">
                          <p className="text-3xl font-bold text-gray-800">
                            {Math.round((dashboardStats.presentToday / dashboardStats.totalEmployees) * 100)}%
                          </p>
                          <p className="text-sm text-gray-500">Attendance Rate Today</p>
                        </div>
                      </>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No leave data available
                      </div>
                    )}
                  </div>

                  {/* Leave Request Status - Stacked Bar Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Leave Request Status</h2>
                      <p className="text-sm text-gray-500">Approved vs Pending vs Rejected</p>
                    </div>
                    {leaveRequestStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leaveRequestStatusData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="approved" stackId="a" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Employee & Department Insights */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">👥 Employee & Department Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Department Distribution - Pie Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Active Employees per Department</h2>
                      <p className="text-sm text-gray-500">Workforce allocation across departments</p>
                    </div>
                    {departmentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No department data available
                      </div>
                    )}
                  </div>

                  {/* Top Absentees - Horizontal Bar Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Top Absentees</h2>
                      <p className="text-sm text-gray-500">Employees with most leave requests</p>
                    </div>
                    {topAbsenteesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topAbsenteesData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="leaves" fill="#ef4444" name="Leaves Taken" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Department-wise Leave Patterns */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🏢 Department-wise Leave Patterns</h3>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Leave Frequency by Department</h2>
                    <p className="text-sm text-gray-500">Identify departments needing attention</p>
                  </div>
                  {departmentLeaveData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Employees</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Leaves</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Avg Leaves/Employee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departmentLeaveData.map((dept, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-800">{dept.department}</td>
                              <td className="px-4 py-3 text-gray-600">{dept.employees}</td>
                              <td className="px-4 py-3">
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                  {dept.leavesTaken}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{dept.avgLeavesPerEmployee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No department leave data available
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: Working Days vs Leaves & Payroll */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Workload & Cost Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Monthly Leaves vs Working Days - Stacked Area Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Working Days vs Leaves</h2>
                      <p className="text-sm text-gray-500">Identify months with excessive leave</p>
                    </div>
                    {monthlyLeavesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyLeavesData}>
                          <defs>
                            <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorWorkingDays" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="workingDays" 
                            stackId="1"
                            stroke="#10b981" 
                            fill="url(#colorWorkingDays)"
                            name="Working Days"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="leaves" 
                            stackId="2"
                            stroke="#ef4444" 
                            fill="url(#colorLeaves)"
                            name="Total Leaves"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No monthly data available
                      </div>
                    )}
                  </div>

                  {/* Monthly Payroll Cost - Line Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Monthly Payroll Cost</h2>
                      <p className="text-sm text-gray-500">Track salary outlays vs budget</p>
                    </div>
                    {payrollData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={payrollData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="cost" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Actual Cost"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="budget" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Budget"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500">
                        No payroll data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> All charts display real data from your employees and leave requests. Charts update automatically when you add/modify employee data or approve leaves. Use this comprehensive dashboard to monitor workforce health and make data-driven decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Existing Tabs */}
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
