import { BookingType, BookingFormData } from '../types/Booking';
import { getRoomById } from './roomService';

// Mock booking data for demo - starting with empty array
let MOCK_BOOKINGS: BookingType[] = [];

export const getAllBookings = async (): Promise<BookingType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_BOOKINGS]);
    }, 500);
  });
};

export const getBookingById = async (id: string): Promise<BookingType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booking = MOCK_BOOKINGS.find(b => b.id === id);
      if (booking) {
        resolve({ ...booking });
      } else {
        reject(new Error('Booking not found'));
      }
    }, 300);
  });
};

export const getCustomerBookings = async (userId: string): Promise<BookingType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = MOCK_BOOKINGS.filter(b => b.userId === userId);
      resolve([...bookings]);
    }, 500);
  });
};

export const createBooking = async (userId: string, roomId: string, formData: BookingFormData): Promise<BookingType> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get room details to calculate price
      const room = await getRoomById(roomId);
      
      // Calculate number of nights
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      
      // Calculate total amount
      const totalAmount = room.pricePerNight * nights;
      
      // Create new booking
      const newBooking: BookingType = {
        id: String(MOCK_BOOKINGS.length + 1),
        userId,
        roomId,
        guestName: formData.guestName,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestCount: formData.guestCount,
        roomType: room.type,
        totalAmount,
        paymentStatus: 'pending',
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : undefined,
        specialRequests: formData.specialRequests,
        createdAt: new Date().toISOString()
      };
      
      MOCK_BOOKINGS.push(newBooking);
      
      setTimeout(() => {
        resolve({ ...newBooking });
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateBooking = async (id: string, updates: Partial<BookingType>): Promise<BookingType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
      if (index !== -1) {
        MOCK_BOOKINGS[index] = { 
          ...MOCK_BOOKINGS[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        resolve({ ...MOCK_BOOKINGS[index] });
      } else {
        reject(new Error('Booking not found'));
      }
    }, 500);
  });
};

export const cancelBooking = async (id: string): Promise<BookingType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
      if (index !== -1) {
        MOCK_BOOKINGS[index] = { 
          ...MOCK_BOOKINGS[index], 
          status: 'cancelled', 
          updatedAt: new Date().toISOString() 
        };
        resolve({ ...MOCK_BOOKINGS[index] });
      } else {
        reject(new Error('Booking not found'));
      }
    }, 500);
  });
};

export const deleteBooking = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
      if (index !== -1) {
        MOCK_BOOKINGS.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error('Booking not found'));
      }
    }, 500);
  });
};
