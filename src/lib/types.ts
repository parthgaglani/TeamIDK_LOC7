export type UserRole = 'employee' | 'finance';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  department?: string;
  createdAt: number;
} 