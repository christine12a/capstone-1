import { UserType } from '../types/User';

// Create a shared mock users array that will be used by both services
export const MOCK_USERS: UserType[] = [
  {
    id: '1',
    fullName: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    phone: '123-456-7890',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    fullName: 'Staff Member',
    email: 'staff@gmail.com',
    password: 'staff123',
    phone: '123-456-7891',
    role: 'staff',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    fullName: 'Customer User',
    email: 'customer@gmail.com',
    password: 'customer123',
    phone: '123-456-7892',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
];

// Helper to initialize mock data - keeping this for backward compatibility
export const getInitialUsers = (): UserType[] => {
  return MOCK_USERS;
};
