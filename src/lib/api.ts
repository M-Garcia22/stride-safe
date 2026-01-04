import { User, UserRole } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
      const response = await fetch(`${API_URL}${endpoint}`, {
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
    }>('/login', {
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
    }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async logout() {
    const result = await this.request('/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return result;
  }

  async getUser() {
    return this.request<User>('/user');
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
}

export type { User } from '@/types/user';

export const api = new ApiClient();

