"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Accept any type for user to allow storing the full API response
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (userData: any, token?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<any>) => void;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (authStatus === 'true' && userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        forceLogout();
      }
    } else if (authStatus === 'true' && (!userData || !token)) {
      // If authentication flag is true but missing data, clear everything
      forceLogout();
    }
  }, []);

  // Listen for auth errors from API interceptor
  useEffect(() => {
    const handleAuthError = () => {
      forceLogout();
    };

    window.addEventListener('auth-error', handleAuthError);
    
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  // Check token expiration on app load
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('auth_token');
      const authStatus = localStorage.getItem('isAuthenticated');
      
      // If we have auth status but no token, clear everything
      if (authStatus === 'true' && !token) {
        forceLogout();
      }
      
      // If we have a token but no auth status, clear everything
      if (token && authStatus !== 'true') {
        forceLogout();
      }
    };

    // Check on mount
    checkTokenValidity();

    // Check when window gains focus (user comes back to tab)
    const handleFocus = () => {
      checkTokenValidity();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Store the full API response as user
  const login = (userData: any, token?: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  // console.log('Update user function:', user.user);
 const updateUser = (userData: Partial<any>) => {
  if (!user) return;

  const updatedUser = {
    ...user,

    // ✅ top-level name update
    name: userData.name ?? user.name,

    // ✅ nested user.name update
    user: {
      ...user.user,
      name: userData.name ?? user.user.name,
    },
  };

  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};

  const forceLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      updateUser,
      forceLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 