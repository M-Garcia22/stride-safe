/**
 * API Configuration
 * Central place to define all API endpoints and settings
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  endpoints: {
    // Auth
    auth: {
      login: '/login',
      register: '/register',
      logout: '/logout',
      user: '/user',
    },
    
    // Reports
    reports: {
      trainer: '/reports/trainer',
      all: '/reports/all',
    },
    
    // Horses (future)
    horses: {
      list: '/horses',
      detail: (id: number | string) => `/horses/${id}`,
    },
    
    // Races (future)
    races: {
      list: '/races',
      detail: (id: number | string) => `/races/${id}`,
    },
  },
} as const;

// Type helpers for endpoint paths
export type AuthEndpoints = typeof API_CONFIG.endpoints.auth;
export type ReportEndpoints = typeof API_CONFIG.endpoints.reports;

