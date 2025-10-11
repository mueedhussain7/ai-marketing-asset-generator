import api from './api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Register new user
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

// Logout (just remove token)
export const logout = (): void => {
  localStorage.removeItem('token');
};