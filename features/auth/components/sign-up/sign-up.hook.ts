'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';
import { createSignUpSchema } from './sign-up.schema';

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export function useSignUp() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);

  const signUpMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await AuthService.signUp(data);
      return response as SignUpResponse;
    },
    onSuccess: (data) => {
      // Backend set cookies automatically, no need to store in localStorage
      setError(null);
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred during sign up');
    },
  });

  const schema = createSignUpSchema(t);

  const form = useForm<SignUpData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignUpData) => {
    setError(null);
    try {
      await signUpMutation.mutateAsync({
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
    isLoading: signUpMutation.isPending,
    onSubmit,
    clearError,
  };
}
