import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getCustomerBookings } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        if (user) {
          const bookings = await getCustomerBookings(user.id);
          setRecentBookings(bookings.slice(0, 3)); // Get only 3 most recent
        }
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.fullName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/customer/search" 
              className="block bg-blue-500 text-white text-center py-3 px-4 rounded hover:bg-blue-600 transition"
            >
              View Available Rooms
            </Link>
            <Link 
              to="/customer/bookings" 
              className="block bg-green-500 text-white text-center py-3 px-4 rounded hover:bg-green-600 transition"
            >
              View My Bookings
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {loading ? (
            <p>Loading your recent bookings...</p>
          ) : recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map(booking => (
                <div key={booking.id} className="border-b pb-3">
                  <p className="font-medium">Booking #{booking.id}</p>
                  <p>Room Type: {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)}</p>
                  <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              ))}
              <Link to="/customer/bookings" className="text-blue-500 hover:underline block text-center mt-2">
                View All Bookings
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You don't have any bookings yet. Start by searching for rooms and making your first reservation!
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/customer/search" className="text-blue-500 hover:underline block text-center mt-2">
                Book a room now
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium">Weekend Special</h3>
            <p className="text-sm">20% off for weekend stays</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium">Extended Stay</h3>
            <p className="text-sm">30% off for stays longer than 5 nights</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium">Early Bird</h3>
            <p className="text-sm">15% off for bookings made 30 days in advance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
