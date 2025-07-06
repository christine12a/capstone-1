import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../services/roomService';
import { RoomType } from '../types/Room';

const RoomSearch: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  // Fetch all available rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const allRooms = await getAllRooms();
        // Filter to only show available rooms
        const availableRooms = allRooms.filter(room => room.status === 'available');
        setRooms(availableRooms);
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError(err.message || 'Error loading available rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (roomId: string) => {
    // Validate booking details before proceeding
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      setError('Please select check-in and check-out dates before booking a room');
      return;
    }
    
    navigate(`/customer/select/${roomId}`, { 
      state: { 
        checkIn: bookingDetails.checkIn, 
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests 
      } 
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading available rooms...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
      
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
      
      {/* Simplified Booking Details Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Your Stay Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="checkIn">
              Check-in Date*
            </label>
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              className="w-full p-2 border rounded"
              value={bookingDetails.checkIn}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="checkOut">
              Check-out Date*
            </label>
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              className="w-full p-2 border rounded"
              value={bookingDetails.checkOut}
              onChange={handleChange}
              min={bookingDetails.checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="guests">
              Number of Guests*
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              className="w-full p-2 border rounded"
              value={bookingDetails.guests}
              onChange={handleChange}
              min="1"
              max="10"
              required
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          *Please select your dates before booking a room
        </p>
      </div>
      
      {/* Display Available Rooms */}
      <div className="bg-white p-6 rounded-lg shadow">
        {rooms.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 inline-block text-left">
              <p className="text-yellow-700">
                No rooms are currently available. Please check back later or contact us directly for assistance.
              </p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Available Rooms ({rooms.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={room.imageUrl || 'https://via.placeholder.com/300x200?text=Room+Image'} 
                      alt={`${room.type} Room`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/300x200?text=Room+Image';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Max Guests: {room.capacity}</span>
                      <span className="font-semibold">₱{room.pricePerNight}/night</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{room.description}</p>
                    <button
                      onClick={() => handleSelect(room.id)}
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomSearch;
