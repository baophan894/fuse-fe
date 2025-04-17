import { NavItem } from '@/types';

export type User = {
  data?: any;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  isFollowerOA: boolean;
  created_at: string;
  get fullName(): string;
};


// Tạo một hàm helper để ghép fullName
export const getFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`.trim();
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number;
  latitude?: number;
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export type Collaborator = {
  id: string
  firstname: string
  lastname: string
  username: string
  gender: string
  phoneNumber: string
  email: string
  applicationStatus: string // 'pending', 'approved', 'rejected'
  idCardFront: string
  idCardBack: string
  faceImage: string // Added facial image
  address: string
  dateOfBirth: string
  submissionDate: string
  rejectionReason?: string // Added rejection reason
  rejectionDetails?: string // Added rejection details
}

export type Insurance = {
  id: string
  carOwnerName: string
  contractRequestName: string
  province: string
  address: string
  phoneNumber: string
  email: string
  yearOfManufacture: string
  unregisteredVehicle: string
  vehicleNumber: string
  frame_number: string
  egine_number: string
  invoice_request: string
}









export type Video = {
  id: number;
  title: string;
  thumbnail: string;
  workoutLevel: string;
  duration: string;
  views: number;
  comments: number;
  ratings: number;
  shares: number;
};
