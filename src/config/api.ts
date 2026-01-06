/**
 * API Configuration
 * Central place to define all API endpoints and settings
 */

// Detect if we're running on localhost for development (Vite dev server)
const isLocalDev = typeof window !== 'undefined' && 
  window.location.hostname === 'localhost' && 
  ['8080', '5173', '3000'].includes(window.location.port);

export const API_CONFIG = {
  // Use relative URL in production, localhost:8000 in dev
  baseUrl: import.meta.env.VITE_API_URL || (isLocalDev ? 'http://localhost:8000/api' : '/api'),
  
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
