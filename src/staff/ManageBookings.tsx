import React, { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getAllBookings();
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };  const handleCancelBooking = async (bookingId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(bookingId);
      await cancelBooking(bookingId);
      
      // Update the local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancelling(null);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="staff-header">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Manage Bookings</h1>
            <p className="text-white text-lg opacity-90">Loading bookings...</p>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="staff-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Bookings</h1>
          <p className="text-white text-lg opacity-90">View and manage all hotel bookings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {error && (
          <div className="alert alert-error mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="text-red-700 hover:text-red-900 font-bold ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}        <div className="data-table">
          <div className="table-header">
            <div className="table-actions">
              <h2>All Bookings</h2>
              <button
                onClick={fetchBookings}
                className="btn-base btn-theme-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No bookings yet</h3>
                <p className="empty-state-description">
                  Bookings made through the system will appear here.
                </p>
              </div>            ) : (
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.guestName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.guestCount} guest(s)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.roomType}</div>
                        <div className="text-sm text-gray-500">ID: {booking.roomId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₱{booking.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          booking.status === 'pending' ? 'badge-warning' :
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'cancelled' ? 'badge-error' :
                          'badge-info'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          booking.paymentStatus === 'pending' ? 'badge-warning' :
                          booking.paymentStatus === 'paid' ? 'badge-success' :
                          'badge-purple'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelling === booking.id}
                            className="btn-base btn-theme-primary btn-sm"
                          >
                            {cancelling === booking.id ? (
                              <>
                                <div className="loading-spinner"></div>
                                Cancelling...
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
