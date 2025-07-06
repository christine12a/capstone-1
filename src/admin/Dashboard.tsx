import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getAllUsers } from '../services/userService';
import { getAllRooms } from '../services/roomService';
import { getAllBookings } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    revenue: 0,
    occupancyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all required data
        const [users, rooms, bookings] = await Promise.all([
          getAllUsers(),
          getAllRooms(),
          getAllBookings()
        ]);
        
        // Calculate statistics
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
        const currentlyOccupied = confirmedBookings.filter(b => 
          new Date(b.checkInDate) <= new Date() && 
          new Date(b.checkOutDate) >= new Date()
        );
        
        // Calculate total revenue
        const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        
        setStats({
          totalUsers: users.length,
          totalRooms: rooms.length,
          totalBookings: bookings.length,
          revenue: revenue,
          occupancyRate: rooms.length > 0 ? (currentlyOccupied.length / rooms.length) * 100 : 0
        });
        
        // Get recent bookings
        const recent = [...bookings].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        
        setRecentBookings(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/admin/users" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Manage Users
          </Link>
          <Link 
            to="/admin/rooms" 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Manage Rooms
          </Link>
        </div>
      </div>
      
      {stats.totalRooms === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your hotel has no rooms yet. Start by adding rooms in the <Link to="/admin/rooms" className="font-medium underline">Manage Rooms</Link> section.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {stats.totalUsers <= 1 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You should create staff accounts to help manage the hotel. Go to <Link to="/admin/users" className="font-medium underline">Manage Users</Link> to add staff.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm uppercase">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm uppercase">Total Rooms</p>
          <p className="text-3xl font-bold">{stats.totalRooms}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm uppercase">Total Bookings</p>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm uppercase">Revenue</p>
          <p className="text-3xl font-bold">₱{stats.revenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm uppercase">Occupancy Rate</p>
          <p className="text-3xl font-bold">{stats.occupancyRate.toFixed(1)}%</p>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        
        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.guestName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.roomType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₱{booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No recent bookings available.</p>
        )}
      </div>
      
      {/* Quick Stats Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
      
      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Database: Online</span>
          </div>
          <div className="bg-green-50 p-4 rounded flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>API Services: Operational</span>
          </div>
          <div className="bg-green-50 p-4 rounded flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Payment Gateway: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
