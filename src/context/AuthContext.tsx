import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';
const ALL_USERS_STORAGE_KEY = 'business_nexus_all_users';

// Seed default mock dataset if localStorage is completely empty
const initialMockUsers: User[] = [
  {
    id: 'E1',
    name: 'Jane Doe',
    email: 'jane@startup.com',
    role: 'entrepreneur',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random',
    bio: 'Building the next big thing.',
    isOnline: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'I1',
    name: 'John Smith',
    email: 'john@venture.com',
    role: 'investor',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Smith&background=random',
    bio: 'Seed stage tech investor.',
    isOnline: true,
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper methods to read/write from local mock system database safely
  const getStoredUsers = (): User[] => {
    const data = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(initialMockUsers));
      return initialMockUsers;
    }
    return JSON.parse(data);
  };

  const saveStoredUsers = (updatedUsers: User[]) => {
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function 
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentUsers = getStoredUsers();
      
      // Find user with matching email and role
      const foundUser = currentUsers.find(u => u.email === email && u.role === role);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid credentials or user not found');
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentUsers = getStoredUsers();
      
      // Check if email already exists
      if (currentUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: `${role[0].toUpperCase()}${currentUsers.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: '',
        isOnline: true,
        createdAt: new Date().toISOString()
      };
      
      // Add user to persistent store array configuration
      const updatedList = [...currentUsers, newUser];
      saveStoredUsers(updatedList);
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentUsers = getStoredUsers();
      
      const targetUser = currentUsers.find(u => u.email === email);
      if (!targetUser) {
        throw new Error('No account found with this email');
      }
      
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error('Invalid or expired reset token');
      }
      
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentUsers = getStoredUsers();
      
      const userIndex = currentUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...currentUsers[userIndex], ...updates };
      currentUsers[userIndex] = updatedUser;
      
      // Commit mutations back to storage configuration
      saveStoredUsers(currentUsers);
      
      // Update current user context if it's the same profile session
      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};