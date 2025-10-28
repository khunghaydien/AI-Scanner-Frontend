'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';
import { createForgotPasswordSchema } from './forgot-password.schema';

export interface ForgotPasswordData {
  email: string;
}

export function useForgotPassword() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await AuthService.forgotPassword(data.email);
      return response as { message: string };
    },
    onSuccess: (data) => {
      setSuccess(data.message || 'Password reset email sent successfully');
      setError(null);
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred');
      setSuccess(null);
    },
  });

  const schema = createForgotPasswordSchema(t);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setError(null);
    setSuccess(null);
    try {
      await forgotPasswordMutation.mutateAsync(data);
      form.reset();
    } catch (err) {
      // Error is handled in onError
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    form,
    error,
    success,
    isLoading: forgotPasswordMutation.isPending,
    onSubmit,
    clearError,
    clearSuccess,
    clearMessages,
  };
}
