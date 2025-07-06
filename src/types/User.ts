export interface UserType {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  createdAt?: string;
  updatedAt?: string;
}
