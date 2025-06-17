export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'buyer' | 'supplier' | 'forwarder' | 'viewer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}