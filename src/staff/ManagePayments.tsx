import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBooking } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const ManagePayments: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    paymentStatus: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];
    
    if (filters.paymentStatus) {
      result = result.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.guestName.toLowerCase().includes(term) ||
        booking.id.toString().includes(term)
      );
    }
    
    setFilteredBookings(result);
  }, [filters, bookings]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      paymentStatus: '',
      searchTerm: ''
    });
  };

  const handlePaymentStatusUpdate = async (bookingId: string, newStatus: 'pending' | 'paid' | 'refunded') => {
    setUpdating(bookingId);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedBooking = await updateBooking(bookingId, { paymentStatus: newStatus });
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? updatedBooking : booking
      ));
      
      setSuccess(`Payment status updated to ${newStatus} successfully!`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Staff Header */}
      <div className="staff-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Payments</h1>
          <p className="text-white text-lg opacity-90">Update payment statuses and process refunds</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Alerts */}
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
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <div className="flex items-center justify-between">
              <span>{success}</span>
              <button 
                onClick={() => setSuccess(null)} 
                className="text-green-700 hover:text-green-900 font-bold ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="filter-panel">
          <div className="filter-grid">
            <div className="filter-group">
              <label className="filter-label" htmlFor="searchTerm">
                Search by Guest Name or Booking ID
              </label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                className="input-theme"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search..."
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label" htmlFor="paymentStatus">
                Filter by Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className="select-theme"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div className="filter-group filter-actions">
              <button
                onClick={clearFilters}
                className="btn-theme-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Payment Management Table */}
        <div className="data-table">
          <div className="table-header">
            <div className="table-actions">
              <h2>Payment Management</h2>
              <div className="flex gap-2">
                <span className="badge badge-warning">{filteredBookings.filter(b => b.paymentStatus === 'pending').length} Pending</span>
                <span className="badge badge-success">{filteredBookings.filter(b => b.paymentStatus === 'paid').length} Paid</span>
                <span className="badge badge-purple">{filteredBookings.filter(b => b.paymentStatus === 'refunded').length} Refunded</span>
              </div>
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest Name</th>
                    <th>Room Type</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Booking Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.roomType}</td>
                      <td>₱{booking.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className="badge badge-gray">
                          {booking.paymentMethod?.toUpperCase() || 'N/A'}
                        </span>
                        {booking.paymentMethod === 'gcash' && booking.gcashNumber && (
                          <div className="text-xs text-gray-500 mt-1">
                            GCash: {booking.gcashNumber}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          booking.paymentStatus === 'paid' ? 'badge-success' :
                          booking.paymentStatus === 'refunded' ? 'badge-purple' :
                          'badge-warning'
                        }`}>
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'pending' ? 'badge-warning' :
                          booking.status === 'cancelled' ? 'badge-error' :
                          'badge-info'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          {booking.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handlePaymentStatusUpdate(booking.id, 'paid')}
                              disabled={updating === booking.id}
                              className="btn-theme-primary btn-sm"
                            >
                              {updating === booking.id ? 'Updating...' : 'Mark Paid'}
                            </button>
                          )}
                          
                          {booking.paymentStatus === 'paid' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handlePaymentStatusUpdate(booking.id, 'refunded')}
                              disabled={updating === booking.id}
                              className="btn-theme-outline btn-sm"
                            >
                              {updating === booking.id ? 'Processing...' : 'Refund'}
                            </button>
                          )}
                          
                          {booking.paymentStatus === 'refunded' && (
                            <span className="text-gray-500 text-sm">Refunded</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="empty-state-title">No payment records found</h3>
              <p className="empty-state-description">
                {bookings.length === 0 
                  ? "There are no bookings in the system yet. Payment records will appear here once customers make reservations."
                  : "No bookings match your current filter criteria. Try adjusting your search or filters."
                }
              </p>
              {bookings.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn-theme-primary mt-4"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Payment Summary */}
        {filteredBookings.length > 0 && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                ₱{filteredBookings
                  .filter(b => b.paymentStatus === 'paid')
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-label">Total Paid</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">
                ₱{filteredBookings
                  .filter(b => b.paymentStatus === 'pending')
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-label">Pending Payments</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">
                ₱{filteredBookings
                  .filter(b => b.paymentStatus === 'refunded')
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-label">Total Refunded</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">
                ₱{filteredBookings
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
