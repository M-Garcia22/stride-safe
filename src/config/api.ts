/**
 * API Configuration
 * Central place to define all API endpoints and settings
 */

// Get base URL at runtime (not build time)
function getBaseUrl(): string {
  // Check for explicit env var first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Runtime check for local development
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    const isLocalDev = hostname === 'localhost' && ['8080', '5173', '3000'].includes(port);
    if (isLocalDev) {
      return 'http://localhost:8000/api';
    }
  }
  
  // Default to relative URL for production
  return '/api';
}

export const API_CONFIG = {
  // Getter ensures runtime evaluation
  get baseUrl() { return getBaseUrl(); },
  
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
    
    // Horses
    horses: {
      trainer: '/horses/trainer',
      stable: '/horses/stable',
      list: '/horses',
      detail: (id: number | string) => `/horses/${id}`,
      history: (horseId: number | string) => `/horses/${horseId}/history`,
    },
    
    // Races (future)
    races: {
      list: '/races',
      detail: (id: number | string) => `/races/${id}`,
    },
    
    // Velocity/Performance data
    velocity: {
      byEntry: (entryCode: number | string) => `/velocity/${entryCode}`,
    },
  },
} as const;

// Type helpers for endpoint paths
export type AuthEndpoints = typeof API_CONFIG.endpoints.auth;
export type ReportEndpoints = typeof API_CONFIG.endpoints.reports;
