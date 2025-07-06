import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getRoomById } from '../services/roomService';
import { RoomType } from '../types/Room';

const RoomSelect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the search parameters from location state
  const { checkIn, checkOut, guests } = location.state || {};
  
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!id) {
          throw new Error('Room ID is required');
        }
        
        const roomData = await getRoomById(id);
        setRoom(roomData);
      } catch (err: any) {
        setError(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [id]);
  
  const handleReserve = () => {
    if (room) {
      navigate(`/customer/reserve/${room.id}`, { 
        state: { checkIn, checkOut, guests, room } 
      });
    }
  };
  
  const handleBack = () => {
    navigate('/customer/search');
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading room details...</div>;
  }
  
  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error || 'Room not found'}
        </div>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Search
        </button>
      </div>
    );
  }
  
  // Calculate number of nights
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))
    : 0;
  
  // Calculate total price
  const totalPrice = room.pricePerNight * nights;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Room Details</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">            <img 
              src={room.imageUrl || 'https://via.placeholder.com/600x400?text=Room+Image'} 
              alt={`${room.type} Room`}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => {
                // Handle image loading errors
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/600x400?text=Room+Image';
              }}
            />
          </div>
          
          <div className="p-6 md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h2>
            <p className="text-gray-600 mb-4">{room.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Room Details:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Room Number: {room.number}</li>
                <li>Max Capacity: {room.capacity} guests</li>
                <li>Price: ₱{room.pricePerNight} per night</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Amenities:</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
        
        {checkIn && checkOut ? (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>Check-in Date:</span>
              <span>{new Date(checkIn).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Check-out Date:</span>
              <span>{new Date(checkOut).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Number of Nights:</span>
              <span>{nights}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Guests:</span>
              <span>{guests}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Room Price per Night:</span>
              <span>₱{room.pricePerNight}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>₱{totalPrice}</span>
            </div>
          </div>
        ) : (
          <p className="text-yellow-600">
            Booking information is incomplete. Please go back to search and select dates.
          </p>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Back to Search
        </button>
        
        <button
          onClick={handleReserve}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          disabled={!checkIn || !checkOut}
        >
          Proceed to Reservation
        </button>
      </div>
    </div>
  );
};

export default RoomSelect;
