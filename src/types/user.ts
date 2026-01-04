export type UserRole = 'track' | 'trainer' | 'vet';

export interface User {
  id: number;
  email: string;
  name: string;
  userType: UserRole;
  organization?: string;
  phone?: string;
  licenseNumber?: string;
}

export interface RoleColors {
  button: string;
  box: string;
  input: string;
  submitButton: string;
  text: string;
  link: string;
}

export interface RoleConfig {
  label: string;
  loginTitle: string;
  dashboardPath: string;
  colors: RoleColors;
}

