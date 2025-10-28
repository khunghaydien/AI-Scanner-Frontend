'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';
import { createSignInSchema } from './sign-in.schema';

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignInResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export function useSignIn() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await AuthService.signIn(data);
      return response as SignInResponse;
    },
    onSuccess: (data) => {
      // Backend set cookies automatically, no need to store in localStorage
      setError(null);
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
