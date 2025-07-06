export interface RoomType {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'family';
  capacity: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  imageUrl?: string;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomSearchParams {
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType?: string;
}
