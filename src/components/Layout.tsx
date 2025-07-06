import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const handleBackToHome = () => {
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `px-3 py-2 rounded-md ${isActive 
      ? 'bg-blue-700 text-white' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">Hotel Reservation System</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {user?.role === 'customer' && (
                    <>
                      <NavLink to="/customer" end className={navLinkClass}>Dashboard</NavLink>
                      <NavLink to="/customer/search" className={navLinkClass}>Available Rooms</NavLink>
                      <NavLink to="/customer/bookings" className={navLinkClass}>My Bookings</NavLink>
                    </>
                  )}                  {user?.role === 'staff' && (
                    <>
                      <NavLink to="/staff" end className={navLinkClass}>Dashboard</NavLink>
                      <NavLink to="/staff/reservations" className={navLinkClass}>Reservations</NavLink>
                      <NavLink to="/staff/manage-bookings" className={navLinkClass}>Manage Bookings</NavLink>
                      <NavLink to="/staff/manage-payments" className={navLinkClass}>Payments</NavLink>
                      <NavLink to="/staff/available-rooms" className={navLinkClass}>Available Rooms</NavLink>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <>
                      <NavLink to="/admin" end className={navLinkClass}>Dashboard</NavLink>
                      <NavLink to="/admin/users" className={navLinkClass}>Manage Users</NavLink>
                      <NavLink to="/admin/rooms" className={navLinkClass}>Manage Rooms</NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center ml-4 md:ml-6">
                <button
                  onClick={handleBackToHome}
                  className="btn-base btn-theme-secondary btn-sm mr-4"
                >
                  Back to Home
                </button>
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-white mr-4">{user?.fullName}</span>
                    <button
                      onClick={handleLogout}
                      className="btn-base btn-theme-primary btn-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-transparent text-gray-300 hover:text-white focus:outline-none focus:text-white"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user?.role === 'customer' && (
              <>
                <NavLink to="/customer" end className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Dashboard
                </NavLink>
                <NavLink to="/customer/search" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Available Rooms
                </NavLink>
                <NavLink to="/customer/bookings" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  My Bookings
                </NavLink>
              </>
            )}            {user?.role === 'staff' && (
              <>
                <NavLink to="/staff" end className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Dashboard
                </NavLink>
                <NavLink to="/staff/reservations" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Reservations
                </NavLink>
                <NavLink to="/staff/manage-bookings" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Manage Bookings
                </NavLink>
                <NavLink to="/staff/manage-payments" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Payments
                </NavLink>
                <NavLink to="/staff/available-rooms" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Available Rooms
                </NavLink>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin" end className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Manage Users
                </NavLink>
                <NavLink to="/admin/rooms" className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }>
                  Manage Rooms
                </NavLink>
              </>
            )}
            
            <div className="px-3 py-3 border-t border-gray-700 mt-3">
              <div className="text-gray-300 mb-2">{user?.fullName}</div>
              <button
                onClick={handleBackToHome}
                className="btn-base btn-theme-secondary btn-sm w-full text-left mb-2"
              >
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="btn-base btn-theme-primary btn-sm w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="py-6 min-h-[calc(100vh-64px-180px)]">
        <Outlet />
      </main>
      
      {/* Fixed Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Hotel Reservation</h3>
              <p className="text-sm mb-4">Experience luxury and comfort with our premium hotel reservation services.</p>
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">About Us</button></li>
                <li><button className="hover:text-white">Contact</button></li>
                <li><button className="hover:text-white">FAQs</button></li>
                <li><button className="hover:text-white">Privacy Policy</button></li>
                <li><button className="hover:text-white">Terms of Service</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Room Booking</button></li>
                <li><button className="hover:text-white">Special Offers</button></li>
                <li><button className="hover:text-white">Dining Options</button></li>
                <li><button className="hover:text-white">Wellness &amp; Spa</button></li>
                <li><button className="hover:text-white">Business Facilities</button></li>
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
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" />
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

export default Layout;
