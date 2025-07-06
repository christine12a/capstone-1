import { UserType } from '../types/User';
import { MOCK_USERS } from '../utils/dataSeed';

// For demo purposes, we'll use local storage
const LOCAL_STORAGE_KEY = 'hotel_auth_user';

export const loginUser = async (email: string, password: string): Promise<UserType> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (user) {
        // Don't store password in local storage
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulating network delay
  });
};

export const registerUser = async (userData: Partial<UserType>): Promise<UserType> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        reject(new Error('Email already in use'));
        return;
      }
      
      // Create new user
      const newUser: UserType = {
        id: String(MOCK_USERS.length + 1),
        fullName: userData.fullName || '',
        email: userData.email || '',
        password: userData.password,
        phone: userData.phone || '',
        role: userData.role || 'customer',
        createdAt: new Date().toISOString()
      };
      
      MOCK_USERS.push(newUser);
      
      // Don't store password in local storage
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      resolve(userWithoutPassword);
    }, 500); // Simulating network delay
  });
};

export const logoutUser = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      resolve();
    }, 200); // Simulating network delay
  });
};

export const getCurrentUser = async (): Promise<UserType | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (userJson) {
        resolve(JSON.parse(userJson));
      } else {
        resolve(null);
      }
    }, 200);
  });
};
