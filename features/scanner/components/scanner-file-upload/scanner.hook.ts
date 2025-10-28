'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createScannerSchema } from './scanner.schema';

export interface ScannerData {
  files: FileList;
}

interface ScannerResponse {
  success: boolean;
  message: string;
  results?: any;
}

// Mock service - replace with actual API call
const ScannerService = {
  uploadFiles: async (data: { files: FileList; description?: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Files uploaded successfully',
      results: null,
    } as ScannerResponse;
  },
};

export function useScanner(t: (key: string) => string) {
  const [error, setError] = useState<string | null>(null);

  const scannerMutation = useMutation({
    mutationFn: async (data: { files: FileList; description?: string }) => {
      const response = await ScannerService.uploadFiles(data);
      return response;
    },
    onSuccess: (data) => {
      setError(null);
      console.log('Scanner upload success:', data);
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred during file upload');
    },
  });

  const schema = createScannerSchema(t);

  const form = useForm<ScannerData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      files: undefined as unknown as FileList,
    },
  });

  const onSubmit = async (data: ScannerData) => {
    setError(null);
    try {
      await scannerMutation.mutateAsync({
        files: data.files,
      });
      // Handle success - maybe show success message or redirect
    } catch (err) {
      // Error is handled in onError
    }
  };

  const clearError = () => setError(null);

  return {
    form,
    error,
    isLoading: scannerMutation.isPending,
    onSubmit,
    clearError,
  };
}
