/**
 * API Configuration
 * Central place to define all API endpoints and settings
 */

// Runtime config - loaded from /config.json or defaults
let runtimeApiUrl: string | null = null;

// Load config from server (called once on app init)
export async function loadRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      runtimeApiUrl = config.apiUrl || '/api';
    }
  } catch {
    // Fallback to /api if config.json doesn't exist or fails
    runtimeApiUrl = '/api';
  }
}

// Get base URL - uses runtime config if loaded, otherwise smart default
function getBaseUrl(): string {
  // If runtime config was loaded, use it
  if (runtimeApiUrl !== null) {
    return runtimeApiUrl;
  }
  
  // Fallback: check if we're on localhost dev server
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    if (hostname === 'localhost' && ['8080', '5173', '3000'].includes(port)) {
      return 'http://localhost:8000/api';
    }
  }
  
  // Default for production
  return '/api';
}

export const API_CONFIG = {
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
