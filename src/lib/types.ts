export type UserRole = 'employee' | 'finance' | 'manager';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: number;
} 