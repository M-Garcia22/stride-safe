import { ReactNode } from 'react';
import { User, UserRole } from './user';

// Auth-specific types
export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface SignUpData {
  name: string;
  userType: UserRole;
  organization?: string;
  phone?: string;
  licenseNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error: AuthError | null }>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// Re-export for convenience
export type { User, UserRole } from './user';

