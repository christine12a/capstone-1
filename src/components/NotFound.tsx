import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NotFound: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Determine where to redirect based on user role
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'staff':
        return '/staff';
      case 'customer':
        return '/customer';
      default:
        return '/login';
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to={getRedirectPath()} 
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
