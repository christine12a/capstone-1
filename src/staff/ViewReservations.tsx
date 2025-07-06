import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookings } from '../services/bookingService';
import { BookingType } from '../types/Booking';

const ViewReservations: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    searchTerm: ''
  });

  // Fetch all bookings
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

  // Filter bookings when filters change
  useEffect(() => {
    let result = [...bookings];
    
    // Filter by status
    if (filters.status) {
      result = result.filter(booking => booking.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      switch (filters.dateRange) {
        case 'today':
          result = result.filter(booking => 
            new Date(booking.checkInDate).toDateString() === today.toDateString()
          );
          break;
        case 'tomorrow':
          result = result.filter(booking => 
            new Date(booking.checkInDate).toDateString() === tomorrow.toDateString()
          );
          break;
        case 'week':
          result = result.filter(booking => 
            new Date(booking.checkInDate) <= nextWeek && 
            new Date(booking.checkInDate) >= today
          );
          break;
        case 'month':
          result = result.filter(booking => 
            new Date(booking.checkInDate) <= nextMonth && 
            new Date(booking.checkInDate) >= today
          );
          break;
      }
    }
    
    // Filter by search term (guest name or booking ID)
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
      status: '',
      dateRange: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading reservations...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Staff Header */}
      <div className="staff-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">All Reservations</h1>
          <p className="text-white text-lg opacity-90">View and manage all guest reservations</p>
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
              <label className="filter-label" htmlFor="status">
                Filter by Status
              </label>
              <select
                id="status"
                name="status"
                className="select-theme"
                value={filters.status}                
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label" htmlFor="dateRange">
                Filter by Date
              </label>
              <select
                id="dateRange"
                name="dateRange"
                className="select-theme"
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">Next 7 Days</option>
                <option value="month">Next 30 Days</option>
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
        
        {/* Bookings List */}
        <div className="data-table">
          <div className="table-header">
            <h2>Reservations Overview</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="empty-state-title">No reservations yet</h3>
              <p className="empty-state-description">
                There are no bookings in the system yet. When customers make reservations, they will appear here.
              </p>
              <Link
                to="/staff"
                className="btn-theme-primary mt-4"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest Name</th>
                    <th>Room Type</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.roomType}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'pending' ? 'badge-warning' :
                          booking.status === 'completed' ? 'badge-info' :
                          'badge-error'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/staff/manage-bookings?id=${booking.id}`}
                          className="text-red-600 hover:text-red-900"
                        >
                          Manage
                        </Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="empty-state-title">No bookings match your criteria</h3>
              <p className="empty-state-description">
                Try adjusting your filters to see more reservations.
              </p>
              <button
                onClick={clearFilters}
                className="btn-theme-primary mt-4"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReservations;
