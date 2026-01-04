import { UserRole, RoleConfig } from '@/types/user';

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  track: {
    label: 'Tracks',
    loginTitle: 'Track Login',
    dashboardPath: '/track-dashboard',
    colors: {
      button: "border-blue-200/60 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300 backdrop-blur-sm",
      box: "bg-gradient-to-br from-blue-50/95 to-blue-100/95 border-blue-200/60 backdrop-blur-lg",
      input: "border-blue-200/60 focus:border-blue-400 bg-white/70 backdrop-blur-sm",
      submitButton: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25",
      text: "text-blue-700",
      link: "text-blue-600 hover:text-blue-700"
    }
  },
  vet: {
    label: 'Vets',
    loginTitle: 'Veterinarian Login',
    dashboardPath: '/vet-dashboard',
    colors: {
      button: "border-purple-200/60 text-purple-600 hover:bg-purple-50/80 hover:border-purple-300 backdrop-blur-sm",
      box: "bg-gradient-to-br from-purple-50/95 to-purple-100/95 border-purple-200/60 backdrop-blur-lg",
      input: "border-purple-200/60 focus:border-purple-400 bg-white/70 backdrop-blur-sm",
      submitButton: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25",
      text: "text-purple-700",
      link: "text-purple-600 hover:text-purple-700"
    }
  },
  trainer: {
    label: 'Trainers',
    loginTitle: 'Trainer Login',
    dashboardPath: '/trainer-dashboard',
    colors: {
      button: "border-orange-200/60 text-orange-600 hover:bg-orange-50/80 hover:border-orange-300 backdrop-blur-sm",
      box: "bg-gradient-to-br from-orange-50/95 to-orange-100/95 border-orange-200/60 backdrop-blur-lg",
      input: "border-orange-200/60 focus:border-orange-400 bg-white/70 backdrop-blur-sm",
      submitButton: "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg shadow-orange-500/25",
      text: "text-orange-700",
      link: "text-orange-600 hover:text-orange-700"
    }
  }
};

export const ROLES: UserRole[] = ['track', 'vet', 'trainer'];

