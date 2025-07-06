import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser, createUser } from '../services/userService';
import { UserType } from '../types/User';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Add success message state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as 'admin' | 'staff' | 'customer' // Specify the type to match UserType
  });

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes - needs to be updated to handle the role type correctly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'role' && (value === 'admin' || value === 'staff' || value === 'customer')) {
      // Type assertion for role values
      setFormData(prev => ({ ...prev, [name]: value as 'admin' | 'staff' | 'customer' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Open modal to add new user
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      id: '',
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'customer'
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing user
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't include the password for security
      phone: user.phone,
      role: user.role
    });
    setIsModalOpen(true);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  // Submit form to create/update user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await updateUser(formData.id, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role as 'admin' | 'staff' | 'customer',
          // Only include password if it was changed
          ...(formData.password ? { password: formData.password } : {})
        });
        
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        
        // Show success message with a reminder of login credentials
        if (formData.role === 'staff' && formData.password) {
          setSuccessMessage(`Staff account updated. They can login with email: ${formData.email} and the password you provided.`);
        } else {
          setSuccessMessage('User updated successfully');
        }
      } else {
        // Create new user
        const newUser = await createUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role as 'admin' | 'staff' | 'customer'
        });
        
        setUsers([...users, newUser]);
        
        // Show success message with a reminder of login credentials
        if (formData.role === 'staff') {
          setSuccessMessage(`Staff account created. They can login with email: ${formData.email} and password: ${formData.password}`);
        } else {
          setSuccessMessage('User created successfully');
        }
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add New User
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          {successMessage}
          <button 
            onClick={() => setSuccessMessage(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password {editingUser && '(Leave blank to keep current)'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  minLength={6}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full p-2 border rounded"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
