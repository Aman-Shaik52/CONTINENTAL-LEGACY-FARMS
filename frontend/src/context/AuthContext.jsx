import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem('token') || '';
};

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const initialToken = getStoredToken();
const initialUser = getStoredUser();

if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const loading = false;

  const persistAuth = (authToken, authUser) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    persistAuth(response.data.token, response.data.user);
    return response.data;
  };

  const signup = async (payload) => {
    const response = await api.post('/auth/signup', payload);
    return response.data;
  };

  const verifyEmailOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-email-otp', { email, otp });
    return response.data;
  };

  const sendPhoneOtp = async (email) => {
    const response = await api.post('/auth/send-phone-otp', { email });
    return response.data;
  };

  const verifyPhoneOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-phone-otp', { email, otp });
    persistAuth(response.data.token, response.data.user);
    return response.data;
  };

  const forgotPassword = async (phone) => {
    const response = await api.post('/auth/forgot-password', { phone });
    return response.data;
  };

  const verifyResetOtp = async (phone, otp) => {
    const response = await api.post('/auth/verify-reset-otp', { phone, otp });
    return response.data;
  };

  const resetPassword = async (phone, newPassword) => {
    const response = await api.post('/auth/reset-password', { phone, newPassword });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Best effort logout for stateless JWT flow
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};