import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getAllBookings } from '../services/bookingService';
import { getRoomAvailabilityCounts } from '../services/roomService';
import { BookingType } from '../types/Booking';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    pendingPayments: 0,
    paidBookings: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0
  });
  const [recentBookings, setRecentBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch bookings and room data
        const [bookings, roomCounts] = await Promise.all([
          getAllBookings(),
          getRoomAvailabilityCounts()
        ]);
        
        // Calculate statistics
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
        const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;
        
        setStats({
          totalBookings: bookings.length,
          pendingBookings,
          confirmedBookings,
          pendingPayments,
          paidBookings,
          totalRooms: roomCounts.total,
          availableRooms: roomCounts.available,
          occupiedRooms: roomCounts.occupied
        });
        
        // Get most recent bookings
        const sortedBookings = [...bookings].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentBookings(sortedBookings.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
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
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Staff Header */}
      <div className="staff-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Staff Dashboard</h1>
          <p className="text-white text-lg opacity-90">Welcome back, {user?.fullName}</p>
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

        {/* Enhanced Quick Actions */}
        <div className="action-card-grid">
          <Link 
            to="/staff/reservations" 
            className="action-card action-card-blue"
          >
            <div className="action-card-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="action-card-title">View Reservations</h2>
            <p className="action-card-description">Manage all guest bookings and check-ins</p>
          </Link>
          
          <Link 
            to="/staff/manage-bookings" 
            className="action-card action-card-red"
          >
            <div className="action-card-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="action-card-title">Manage Bookings</h2>
            <p className="action-card-description">Cancel and update booking statuses</p>
          </Link>
          
          <Link 
            to="/staff/manage-payments" 
            className="action-card action-card-emerald"
          >
            <div className="action-card-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="action-card-title">Manage Payments</h2>
            <p className="action-card-description">Update payment statuses and process refunds</p>
          </Link>
          
          <Link 
            to="/staff/available-rooms" 
            className="action-card action-card-purple"
          >
            <div className="action-card-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0" />
              </svg>
            </div>
            <h2 className="action-card-title">Available Rooms</h2>
            <p className="action-card-description">Check room availability and status</p>
          </Link>
        </div>
        
        {/* Enhanced Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
            <div className="stat-badges">
              <span className="badge badge-info">{stats.pendingBookings} Pending</span>
              <span className="badge badge-success">{stats.confirmedBookings} Confirmed</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.paidBookings}</div>
            <div className="stat-label">Payment Status</div>
            <div className="stat-badges">
              <span className="badge badge-warning">{stats.pendingPayments} Pending Payments</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.totalRooms}</div>
            <div className="stat-label">Room Status</div>
            <div className="stat-badges">
              <span className="badge badge-success">{stats.availableRooms} Available</span>
              <span className="badge badge-error">{stats.occupiedRooms} Occupied</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {recentBookings.filter(b => 
                new Date(b.checkInDate).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div className="stat-label">Today's Check-ins</div>
            <div className="stat-badges">
              <Link to="/staff/reservations" className="text-blue-600 text-sm hover:underline">
                View Today's Arrivals
              </Link>
            </div>
          </div>
        </div>
        {/* Recent Bookings */}        
        {/* Enhanced Recent Bookings */}
        <div className="data-table">
          <div className="table-header">
            <div className="table-actions">
              <h2>Recent Reservations</h2>
              <Link 
                to="/staff/reservations"
                className="btn-theme-secondary"
              >
                View All Reservations →
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {recentBookings.length > 0 ? (
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.guestName}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
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
                        <span className={`badge ${
                          booking.paymentStatus === 'paid' ? 'badge-success' :
                          booking.paymentStatus === 'refunded' ? 'badge-purple' :
                          'badge-warning'
                        }`}>
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/staff/manage-bookings?id=${booking.id}`}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Manage
                        </Link>
                        <Link 
                          to={`/staff/manage-payments`}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          Payment
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No reservations yet</h3>
                <p className="empty-state-description">
                  Customer bookings will appear here once they make reservations.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Today's Tasks */}
        <div className="data-table mt-8">
          <div className="table-header">
            <h2>Today's Tasks</h2>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Check-in arriving guests</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Process pending payments</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Update room status</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
