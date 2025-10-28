'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useUserProfile() {
  // With httpOnly cookies, we always try to fetch user data
  // Query to check if user is authenticated
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await AuthService.getMe();
      return response as User;
    },
    retry: false,
    refetchOnWindowFocus: true,
    enabled: true, // Always try to fetch, backend will return 401 if not authenticated
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await AuthService.signOut();
    },
    onSuccess: () => {
      window.location.href = '/sign-in';
    },
  });

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    signOut: handleSignOut,
  };
}
