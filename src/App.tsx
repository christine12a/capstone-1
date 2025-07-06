import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';

// Public Components
import Home from './components/Home';

// Auth Components
import Login from './auth/Login';
import Register from './auth/Register';

// Customer Components
import CustomerDashboard from './customer/Dashboard';
import RoomSearch from './customer/RoomSearch';
import RoomSelect from './customer/RoomSelect';
import MakeReservation from './customer/MakeReservation';
import CustomerBookings from './customer/MyBookings';

// Staff Components
import StaffDashboard from './staff/Dashboard';
import ViewReservations from './staff/ViewReservations';
import ManageBookings from './staff/ManageBookings';
import ManagePayments from './staff/ManagePayments';
import ViewAvailableRooms from './staff/ViewAvailableRooms';

// Admin Components
import AdminDashboard from './admin/Dashboard';
import ManageUsers from './admin/ManageUsers';
import ManageRooms from './admin/ManageRooms';

// Shared Components
import Layout from './components/Layout';
import NotFound from './components/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<CustomerDashboard />} />
            <Route path="search" element={<RoomSearch />} />
            <Route path="select/:id" element={<RoomSelect />} />
            <Route path="reserve/:roomId" element={<MakeReservation />} />
            <Route path="bookings" element={<CustomerBookings />} />
          </Route>
            {/* Staff Routes */}
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<StaffDashboard />} />
            <Route path="reservations" element={<ViewReservations />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
            <Route path="manage-payments" element={<ManagePayments />} />
            <Route path="available-rooms" element={<ViewAvailableRooms />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="rooms" element={<ManageRooms />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
