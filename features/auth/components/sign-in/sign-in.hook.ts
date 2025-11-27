'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';
import { createSignInSchema } from './sign-in.schema';
import { tokenStorage } from '@/lib/auth/token-storage';
import { useRouter } from 'next/navigation';

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export function useSignIn() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const signInMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await AuthService.signIn(data);
      return response as SignInResponse;
    },
    onSuccess: async (data: SignInResponse) => {
      setError(null);
      
      // Lưu tokens vào localStorage
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      
      // Invalidate và refetch user profile
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await queryClient.refetchQueries({ queryKey: ['auth', 'me'] });
      
      // Redirect on success
      router.push('/');
      router.refresh();
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred during sign in');
    },
  });

  const schema = createSignInSchema(t);

  const form = useForm<SignInData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: SignInData) => {
    setError(null);
    try {
      await signInMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      // Redirect on success
      window.location.href = '/';
    } catch (err) {
      // Error is handled in onError
    }
  };

  const clearError = () => setError(null);

  return {
    form,
    error,
    isLoading: signInMutation.isPending,
    onSubmit,
    clearError,
  };
}
