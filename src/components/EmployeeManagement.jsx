import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
const [employees, setEmployees] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingEmployee, setEditingEmployee] = useState(null);
const [formData, setFormData] = useState({
name: '',
username: '',
password: '',
email: '',
department: '',
position: '',
salary: ''
});
const [error, setError] = useState('');

useEffect(() => {
// Load employees from localStorage
const savedEmployees = localStorage.getItem('employees');
if (savedEmployees) {
setEmployees(JSON.parse(savedEmployees));
}
}, []);

const handleSubmit = (e) => {
e.preventDefault();
setError('');
//
// Validate form
if (!formData.name || !formData.username || !formData.password || !formData.email) {
  setError('Please fill in all required fields');
  return;
}

// Check if username already exists (when creating new employee)
if (!editingEmployee && employees.some(emp => emp.username === formData.username)) {
  setError('Username already exists');
  return;
}

let updatedEmployees;

if (editingEmployee) {
  // Update existing employee
  updatedEmployees = employees.map(emp =>
    emp.id === editingEmployee.id
      ? { ...editingEmployee, ...formData, updatedAt: new Date().toISOString() }
      : emp
  );
} else {
  // Create new employee
  const newEmployee = {
    id: Date.now(),
    ...formData,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  updatedEmployees = [...employees, newEmployee];
}

setEmployees(updatedEmployees);
localStorage.setItem('employees', JSON.stringify(updatedEmployees));

// Reset form
setFormData({
  name: '',
  username: '',
  password: '',
  email: '',
  department: '',
  position: '',
  salary: ''
});
setShowForm(false);
setEditingEmployee(null);
//
};

const handleEdit = (employee) => {
setEditingEmployee(employee);
setFormData({
name: employee.name,
username: employee.username,
password: employee.password,
email: employee.email,
department: employee.department || '',
position: employee.position || '',
salary: employee.salary || ''
});
setShowForm(true);
setError('');
};

const handleDelete = (employeeId) => {
if (window.confirm('Are you sure you want to delete this employee?')) {
const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
setEmployees(updatedEmployees);
localStorage.setItem('employees', JSON.stringify(updatedEmployees));
}
};

const toggleEmployeeStatus = (employeeId) => {
const updatedEmployees = employees.map(emp =>
emp.id === employeeId
? { ...emp, isActive: !emp.isActive, updatedAt: new Date().toISOString() }
: emp
);
setEmployees(updatedEmployees);
localStorage.setItem('employees', JSON.stringify(updatedEmployees));
};

const handleCancel = () => {
setShowForm(false);
setEditingEmployee(null);
setFormData({
name: '',
username: '',
password: '',
email: '',
department: '',
position: '',
salary: ''
});
setError('');
};

return (
<div className="bg-white shadow rounded-lg">
<div className="px-4 py-5 sm:p-6">
<div className="flex justify-between items-center mb-6">
<h2 className="text-lg font-medium text-gray-900">Employee Management</h2>
<button
onClick={() => { setShowForm(true); setEditingEmployee(null); }}
className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
>
Add Employee
</button>
</div>

 {/* Add/Edit Employee Form */}
    {showForm && (
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="number"
                inputMode="decimal"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., 45000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Employee List */}
    {employees.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-gray-500">No employees found. Add your first employee to get started.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {employee.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.department || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.position || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.salary ? `₹ ${employee.salary}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleEmployeeStatus(employee.id)}
                      className={`${employee.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {employee.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>



);
};

export default EmployeeManagement;



//*************************end here upper code is add salary option only********************************
