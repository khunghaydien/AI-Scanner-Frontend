'use client';

import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';

export type SocialProvider = 'google';

interface SocialAuthResponse {
  authUrl: string;
}

export function useSocialAuth() {
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const response = await AuthService.googleSignIn();
      return response as SocialAuthResponse;
    },
    onSuccess: (data) => {
      setAuthUrl(data.authUrl);
      setError(null);
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred');
      setAuthUrl(null);
    },
  });

  const handleSignInWithGoogle = async () => {
    setError(null);
    setAuthUrl(null);
    try {
      await googleSignInMutation.mutateAsync();
    } catch (err) {
      // Error is handled in onError
    }
  };

  const clearError = () => setError(null);
  const clearAuthUrl = () => setAuthUrl(null);
  const clearAll = () => {
    setError(null);
    setAuthUrl(null);
  };

  return {
    signInWithGoogle: handleSignInWithGoogle,
    isLoading: googleSignInMutation.isPending,
    error,
    authUrl,
    clearError,
    clearAuthUrl,
    clearAll,
  };
}
