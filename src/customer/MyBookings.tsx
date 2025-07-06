import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getCustomerBookings, cancelBooking } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Get success message from location state if available
  useEffect(() => {
    if (location.state?.success && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state after displaying the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Fetch customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const data = await getCustomerBookings(user.id);
          setBookings(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const updatedBooking = await cancelBooking(bookingId);
        setBookings(bookings.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        ));
        setSuccessMessage('Booking cancelled successfully');
      } catch (err: any) {
        setError(err.message || 'Failed to cancel booking');
      }
    }
  };
  
  // Group bookings by status
  const upcomingBookings = bookings.filter(b => 
    (b.status === 'confirmed' || b.status === 'pending') && 
    new Date(b.checkInDate) > new Date()
  );
  
  const pastBookings = bookings.filter(b => 
    new Date(b.checkOutDate) < new Date() || b.status === 'cancelled'
  );
  
  if (loading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
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
      
      {bookings.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 inline-block text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You don't have any bookings yet. Start by searching for available rooms and make your first reservation!
                </p>
              </div>
            </div>
          </div>
          <Link 
            to="/customer/search" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Book a Room
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming Bookings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
            
            {upcomingBookings.length === 0 ? (
              <p>No upcoming bookings.</p>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room
                          </h3>
                          <p className="text-gray-600">Booking #{booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Guests</p>
                          <p className="font-semibold">{booking.guestCount}</p>
                        </div>
                          <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold">₱{booking.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className={`font-semibold ${
                          booking.paymentStatus === 'paid' ? 'text-green-600' : 
                          booking.paymentStatus === 'refunded' ? 'text-purple-600' : 
                          'text-yellow-600'
                        }`}>
                          {booking.paymentStatus.toUpperCase()}
                        </p>
                      </div>
                      
                      {booking.specialRequests && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Special Requests</p>
                          <p className="text-sm">{booking.specialRequests}</p>
                        </div>
                      )}
                      
                      {booking.status !== 'cancelled' && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Past Bookings */}
          <div>
            <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
            
            {pastBookings.length === 0 ? (
              <p>No past bookings.</p>
            ) : (
              <div className="space-y-4">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room
                          </h3>
                          <p className="text-gray-600">Booking #{booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Guests</p>
                          <p className="font-semibold">{booking.guestCount}</p>
                        </div>
                          <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold">₱{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookings;
