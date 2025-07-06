import { UserType } from '../types/User';
import { MOCK_USERS } from '../utils/dataSeed';

export const getAllUsers = async (): Promise<UserType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return users without passwords
      const usersWithoutPasswords = MOCK_USERS.map(({ password, ...user }) => user);
      resolve(usersWithoutPasswords as UserType[]);
    }, 500);
  });
};

export const getUserById = async (id: string): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.id === id);
      if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword as UserType);
      } else {
        reject(new Error('User not found'));
      }
    }, 300);
  });
};

export const createUser = async (userData: Partial<UserType>): Promise<UserType> => {
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
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      resolve(userWithoutPassword as UserType);
    }, 500);
  });
};

export const updateUser = async (id: string, userData: Partial<UserType>): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === id);
      if (index !== -1) {
        // Update user
        MOCK_USERS[index] = { 
          ...MOCK_USERS[index], 
          ...userData,
          updatedAt: new Date().toISOString() 
        };
        
        // Return user without password
        const { password, ...userWithoutPassword } = MOCK_USERS[index];
        resolve(userWithoutPassword as UserType);
      } else {
        reject(new Error('User not found'));
      }
    }, 500);
  });
};

export const deleteUser = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === id);
      if (index !== -1) {
        MOCK_USERS.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error('User not found'));
      }
    }, 500);
  });
};
