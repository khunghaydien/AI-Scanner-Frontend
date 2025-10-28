'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useState } from 'react';
import { createChangePasswordSchema } from './change-password.schema';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function useChangePassword() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await AuthService.changePassword(data);
      return response as { message: string };
    },
    onSuccess: (data) => {
      setSuccess(data.message || 'Password changed successfully');
      setError(null);
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred');
      setSuccess(null);
    },
  });

  const schema = createChangePasswordSchema(t);

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setError(null);
    setSuccess(null);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
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
    isLoading: changePasswordMutation.isPending,
    onSubmit,
    clearError,
    clearSuccess,
    clearMessages,
  };
}
