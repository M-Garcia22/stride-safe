import { User, UserRole } from '@/types/user';
import { Report } from '@/types/report';
import { TrainerHorse } from '@/types/horse';
import { VelocityApiResponse } from '@/types/velocity';
import { API_CONFIG } from '@/config/api';

const { baseUrl, endpoints } = API_CONFIG;

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: ApiError | null }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: {
            message: data.message || 'An error occurred',
            errors: data.errors,
          },
        };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : 'Network error',
        },
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const result = await this.request<{
      user: User;
      token: string;
    }>(endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_type: UserRole;
    organization?: string;
    phone?: string;
    license_number?: string;
  }) {
    const result = await this.request<{
      user: User;
      token: string;
    }>(endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async logout() {
    const result = await this.request(endpoints.auth.logout, {
      method: 'POST',
    });
    this.setToken(null);
    return result;
  }

  async getUser() {
    return this.request<User>(endpoints.auth.user);
  }

  // Generic GET/POST methods for future use
  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Report endpoints
  async getTrainerReports(days: number = 7) {
    return this.request<{
      reports: Report[];
      meta: {
        days: number;
        total: number;
        newCount: number;
      };
    }>(`${endpoints.reports.trainer}?days=${days}`);
  }

  async getAllReports(days: number = 7) {
    return this.request<{
      reports: Report[];
      meta: {
        days: number;
        total: number;
        newCount: number;
      };
    }>(`${endpoints.reports.all}?days=${days}`);
  }

  // Horse endpoints
  async getTrainerHorses() {
    return this.request<{
      horses: TrainerHorse[];
      meta: {
        total: number;
        trainerCode: string;
      };
    }>(endpoints.horses.trainer);
  }

  async getTrainerStable() {
    return this.request<{
      horses: TrainerHorse[];
      meta: {
        total: number;
        trainerCode: string;
      };
    }>(endpoints.horses.stable);
  }

  // Velocity/Performance data
  async getVelocityData(entryCode: number | string) {
    return this.request<VelocityApiResponse>(endpoints.velocity.byEntry(entryCode));
  }
}

export type { User } from '@/types/user';

export const api = new ApiClient();
