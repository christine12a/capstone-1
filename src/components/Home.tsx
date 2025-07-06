import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRooms } from '../services/roomService';
import { RoomType } from '../types/Room';

const Home: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getAllRooms();
        // Only show available rooms
        const availableRooms = allRooms.filter(room => room.status === 'available');
        setRooms(availableRooms);
      } catch (err: any) {
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PublicNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Loading available rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PublicNavbar />
      
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Hotel Room</h1>
          <p className="text-xl mb-8">Browse our selection of premium rooms for your next stay</p>
          <button 
            onClick={handleLoginClick}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Sign In to Book Now
          </button>
        </div>
      </div>

      {/* Available Rooms Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Rooms</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
            {error}
          </div>
        )}
        
        {rooms.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 inline-block text-left">
              <p className="text-yellow-700">
                No rooms are currently available. Please check back later.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Room+Image'} 
                    alt={`${room.type} Room`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Available</span>
                  </div>
                  <p className="text-gray-600 mb-4">₱{room.pricePerNight} per night</p>
                  <p className="text-gray-700 mb-4">{room.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLoginClick}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    Login to Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-500 mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Premium Comfort</h3>
              <p className="text-gray-600">Experience luxury with our high-quality accommodations and amenities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-500 mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Our booking system ensures your reservation is safe and secure.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-500 mb-4">👍</div>
              <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">Find the best rates for your stay with our competitive pricing.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8">Create an account or sign in to make a reservation</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Sign In
            </Link>
            <Link to="/register" className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
              Register
            </Link>
          </div>
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Hotel Reservation</h3>
              <p className="text-sm mb-4">Experience luxury and comfort with our premium hotel reservation services.</p>              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
              <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white text-left">About Us</button></li>
                <li><button className="hover:text-white text-left">Contact</button></li>
                <li><button className="hover:text-white text-left">FAQs</button></li>
                <li><button className="hover:text-white text-left">Privacy Policy</button></li>
                <li><button className="hover:text-white text-left">Terms of Service</button></li>
              </ul>
            </div>
              <div>
              <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white text-left">Room Booking</button></li>
                <li><button className="hover:text-white text-left">Special Offers</button></li>
                <li><button className="hover:text-white text-left">Dining Options</button></li>
                <li><button className="hover:text-white text-left">Wellness &amp; Spa</button></li>
                <li><button className="hover:text-white text-left">Business Facilities</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Hotel Street, City, Country</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@hotelreservation.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <p className="text-center text-sm">
              &copy; {new Date().getFullYear()} Hotel Reservation System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Public Navbar Component
const PublicNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600">Hotel Reservation System</Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 px-4 py-2 mx-2 rounded transition"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Home;
