import { useState, useEffect } from 'react';
import { userAPI, roleAPI } from '../services/api';

interface UserManagementState {
  users: any[];
  roles: any[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
  filters: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  };
}

export function useUserManagement() {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    roles: [],
    loading: true,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },
    filters: {
      page: 1,
      limit: 10
    }
  });

  useEffect(() => {
    fetchData();
  }, [state.filters]);

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const [usersResponse, rolesResponse] = await Promise.all([
        userAPI.getAll(state.filters),
        roleAPI.getAll()
      ]);

      setState(prev => ({
        ...prev,
        users: usersResponse.data.users,
        roles: rolesResponse.data,
        pagination: {
          currentPage: usersResponse.data.currentPage,
          totalPages: usersResponse.data.totalPages,
          total: usersResponse.data.total
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching user management data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const createUser = async (userData: any) => {
    try {
      await userAPI.create(userData);
      await fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    try {
      await userAPI.update(userId, updates);
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await userAPI.delete(userId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      await userAPI.resetPassword(userId, newPassword);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const deactivateUserSessions = async (userId: string) => {
    try {
      await userAPI.deactivateSessions(userId);
    } catch (error) {
      console.error('Error deactivating user sessions:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters: Partial<typeof state.filters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  return {
    ...state,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    deactivateUserSessions,
    updateFilters,
    refetch: fetchData
  };
}