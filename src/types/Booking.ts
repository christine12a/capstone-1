export interface BookingType {
  id: string;
  userId: string;
  roomId: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'cash' | 'gcash';
  gcashNumber?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingFormData {
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests: string;
  paymentMethod: 'cash' | 'gcash';
  gcashNumber?: string;
}
