import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { createBooking } from '../services/bookingService';
import { BookingFormData } from '../types/Booking';
import { RoomType } from '../types/Room';

const MakeReservation: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from location state
  const { checkIn, checkOut, guests, room } = location.state || {};
  const roomData: RoomType = room;
  
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: user?.fullName || '',
    checkInDate: checkIn || '',
    checkOutDate: checkOut || '',
    guestCount: guests || 1,
    specialRequests: '',
    paymentMethod: 'cash', // Default payment method
    gcashNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate number of nights
  const nights = formData.checkInDate && formData.checkOutDate 
    ? Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 3600 * 24))
    : 0;
  
  // Calculate total price
  const totalPrice = roomData ? roomData.pricePerNight * nights : 0;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!user || !roomId) {
        throw new Error('Missing user or room information');
      }
      
      await createBooking(user.id, roomId, formData);
      
      // Redirect to success page or bookings page
      navigate('/customer/bookings', { 
        state: { success: true, message: 'Reservation submitted successfully!' } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to make reservation');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (!roomData || !roomId || !checkIn || !checkOut) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          Reservation information is incomplete. Please go back and try again.
        </div>
        <button
          onClick={() => navigate('/customer/search')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Room Search
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Reservation</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Guest Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="guestName">
                  Full Name
                </label>
                <input
                  id="guestName"
                  name="guestName"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="checkInDate">
                    Check-in Date
                  </label>
                  <input
                    id="checkInDate"
                    name="checkInDate"
                    type="date"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={formData.checkInDate}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="checkOutDate">
                    Check-out Date
                  </label>
                  <input
                    id="checkOutDate"
                    name="checkOutDate"
                    type="date"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={formData.checkOutDate}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="guestCount">
                  Number of Guests
                </label>
                <input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  max={roomData.capacity}
                  required
                />
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Cash on Arrival</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="gcash"
                      checked={formData.paymentMethod === 'gcash'}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">GCash</span>
                  </label>
                </div>
              </div>
              
              {/* GCash Number Input - Only show if GCash is selected */}
              {formData.paymentMethod === 'gcash' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="gcashNumber">
                    Your GCash Number
                  </label>
                  <input
                    id="gcashNumber"
                    name="gcashNumber"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.gcashNumber}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    required={formData.paymentMethod === 'gcash'}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please make payment to: 09123456789
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="specialRequests">
                  Special Requests (optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  className="w-full p-2 border rounded"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Reservation Summary</h2>
            
            <div className="mb-4">
              <img 
                src={roomData.imageUrl || 'https://via.placeholder.com/300x200?text=Room+Image'} 
                alt={`${roomData.type} Room`}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{roomData.type.charAt(0).toUpperCase() + roomData.type.slice(1)} Room</h3>
              <p className="text-sm text-gray-600">Room {roomData.number}</p>
            </div>
            
            <div className="space-y-3 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span>Check-in:</span>
                <span>{new Date(formData.checkInDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Check-out:</span>
                <span>{new Date(formData.checkOutDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Guests:</span>
                <span>{formData.guestCount}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Room Rate:</span>
                <span>₱{roomData.pricePerNight}/night</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Payment Method:</span>
                <span>{formData.paymentMethod === 'cash' ? 'Cash on Arrival' : 'GCash'}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Price:</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Cancellation Policy: Free cancellation up to 24 hours before check-in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeReservation;
