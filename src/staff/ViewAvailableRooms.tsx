import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/roomService';
import { RoomType } from '../types/Room';

const ViewAvailableRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'available',
    type: '',
    searchTerm: ''
  });

  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
        // Initially filter to show only available rooms
        setFilteredRooms(data.filter(room => room.status === 'available'));
      } catch (err: any) {
        setError(err.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Filter rooms when filters change
  useEffect(() => {
    let result = [...rooms];
    
    // Filter by status
    if (filters.status) {
      result = result.filter(room => room.status === filters.status);
    }
    
    // Filter by room type
    if (filters.type) {
      result = result.filter(room => room.type === filters.type);
    }
    
    // Filter by search term (room number or description)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(room => 
        room.number.toLowerCase().includes(term) ||
        room.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredRooms(result);
  }, [filters, rooms]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'available',
      type: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Staff Header */}
      <div className="staff-header">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Available Rooms</h1>
          <p className="text-white text-lg opacity-90">View and manage room availability</p>
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
                Search by Room Number or Description
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label" htmlFor="type">
                Filter by Room Type
              </label>
              <select
                id="type"
                name="type"
                className="select-theme"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
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
        {/* Rooms Display */}
        <div className="data-table">
          <div className="table-header">
            <h2>Room Overview</h2>
          </div>

          {rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="empty-state-title">No rooms available</h3>
              <p className="empty-state-description">
                There are no rooms in the system yet. Please ask an administrator to add rooms.
              </p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredRooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-image">
                    <img 
                      src={room.imageUrl || 'https://via.placeholder.com/400x200?text=Room+Image'} 
                      alt={`${room.type} Room ${room.number}`}
                    />
                    <div className="room-status">
                      <span className={`badge ${
                        room.status === 'available' ? 'badge-success' :
                        room.status === 'occupied' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {room.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="room-details">
                    <div className="room-header">
                      <div>
                        <h2 className="room-title">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h2>
                        <p className="room-number">Room {room.number}</p>
                      </div>
                      <p className="room-price">₱{room.pricePerNight}/night</p>
                    </div>
                    
                    <p className="room-description">{room.description}</p>
                    
                    <div className="room-amenities">
                      <p className="amenities-title">Capacity: {room.capacity} guests</p>
                      <p className="amenities-title">Amenities:</p>
                      <div className="amenities-list">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="empty-state-title">No rooms match your criteria</h3>
              <p className="empty-state-description">
                Try adjusting your filters to see more rooms.
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

export default ViewAvailableRooms;
