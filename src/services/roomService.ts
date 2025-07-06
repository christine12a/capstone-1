import { RoomType, RoomSearchParams } from '../types/Room';

// Mock room data for demo - starting with empty array
const MOCK_ROOMS: RoomType[] = [];

// Function to handle image upload
export const uploadRoomImage = async (file: File): Promise<{ imageUrl: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would upload to a server or cloud storage
      // For the mock, we'll use the FileReader API to create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real application, this would be a URL from your server or cloud storage
        const imageUrl = reader.result as string;
        
        // Debug log - let's verify the image URL is correctly set
        console.log('Uploaded image URL:', imageUrl.substring(0, 50) + '...');
        
        resolve({ imageUrl });
      };
      reader.readAsDataURL(file);
    }, 1000); // Simulate network delay
  });
};

export const getAllRooms = async (): Promise<RoomType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ROOMS]);
    }, 500);
  });
};

export const getRoomById = async (id: string): Promise<RoomType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const room = MOCK_ROOMS.find(r => r.id === id);
      if (room) {
        resolve({ ...room });
      } else {
        reject(new Error('Room not found'));
      }
    }, 300);
  });
};

export const searchRooms = async (params: RoomSearchParams): Promise<RoomType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRooms = [...MOCK_ROOMS];
      
      // Filter by room type if specified
      if (params.roomType) {
        filteredRooms = filteredRooms.filter(room => room.type === params.roomType);
      }
      
      // Filter by capacity
      filteredRooms = filteredRooms.filter(room => room.capacity >= params.guestCount);
      
      // Filter by status
      filteredRooms = filteredRooms.filter(room => room.status === 'available');
      
      // In a real app, we'd also check bookings to see if a room is available for the specific dates
      // This would involve checking if there are any overlapping bookings for each room
      
      resolve(filteredRooms);
    }, 500);
  });
};

// Add a new function to get room availability count
export const getRoomAvailabilityCounts = async (): Promise<{
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_ROOMS.length;
      const available = MOCK_ROOMS.filter(room => room.status === 'available').length;
      const occupied = MOCK_ROOMS.filter(room => room.status === 'occupied').length;
      const maintenance = MOCK_ROOMS.filter(room => room.status === 'maintenance').length;
      
      resolve({
        total,
        available,
        occupied,
        maintenance
      });
    }, 300);
  });
};

export const createRoom = async (roomData: Partial<RoomType>): Promise<RoomType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRoom: RoomType = {
        id: String(MOCK_ROOMS.length + 1),
        number: roomData.number || '',
        type: roomData.type || 'standard',
        capacity: roomData.capacity || 2,
        pricePerNight: roomData.pricePerNight || 99,
        description: roomData.description || '',
        amenities: roomData.amenities || [],
        imageUrl: roomData.imageUrl || '',
        status: roomData.status || 'available',
        createdAt: new Date().toISOString()
      };
      
      // Debug log to ensure imageUrl is set correctly
      console.log('Creating room with image URL:', newRoom.imageUrl?.substring(0, 50) + '...');
      
      MOCK_ROOMS.push(newRoom);
      resolve({ ...newRoom });
    }, 500);
  });
};

export const updateRoom = async (id: string, roomData: Partial<RoomType>): Promise<RoomType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ROOMS.findIndex(r => r.id === id);
      if (index !== -1) {
        MOCK_ROOMS[index] = { ...MOCK_ROOMS[index], ...roomData, updatedAt: new Date().toISOString() };
        resolve({ ...MOCK_ROOMS[index] });
      } else {
        reject(new Error('Room not found'));
      }
    }, 500);
  });
};

export const deleteRoom = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ROOMS.findIndex(r => r.id === id);
      if (index !== -1) {
        MOCK_ROOMS.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error('Room not found'));
      }
    }, 500);
  });
};

// Add a function to get all available rooms
export const getAvailableRooms = async (): Promise<RoomType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const availableRooms = MOCK_ROOMS.filter(room => room.status === 'available');
      resolve([...availableRooms]);
    }, 500);
  });
};
