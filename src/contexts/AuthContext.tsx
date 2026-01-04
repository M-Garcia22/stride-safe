import { createContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AuthContextType, AuthProviderProps, User, SignUpData } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data, error } = await api.getUser();
      if (error) {
        api.setToken(null);
        setUser(null);
      } else if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      api.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await api.login(email, password);
      
      if (error) {
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
      }

      return { error: null };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  };

  const signOut = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      const { data, error } = await api.register({
        name: userData.name,
        email,
        password,
        password_confirmation: password,
        user_type: userData.userType,
        organization: userData.organization,
      });

      if (error) {
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
      }

      return { error: null };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
