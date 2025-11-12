'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createMediaSchema } from './media.schema';
import { MediaService, Media } from '@/services/media.service';

export interface MediaData {
  files: FileList;
}

interface MediaResponse {
  success: boolean;
  message: string;
  results: Media[];
  errors?: Array<{ fileName: string; error: string }>;
}

/**
 * Validate files array
 */
function validateFiles(filesArray: File[]): void {
  if (filesArray.length === 0) {
    throw new Error('No files selected');
  }
}

/**
 * Build response message based on results and errors
 */
function buildResponseMessage(
  successCount: number,
  errorCount: number
): string {
  if (successCount > 0 && errorCount === 0) {
    return `${successCount} file(s) uploaded successfully`;
  } else if (successCount > 0 && errorCount > 0) {
    return `${successCount} file(s) uploaded successfully, ${errorCount} file(s) failed`;
  } else {
    return `All ${errorCount} file(s) failed to upload`;
  }
}

/**
 * Build response object from results and errors
 */
function buildResponse(
  results: Media[],
  errors: Array<{ fileName: string; error: string }>
): MediaResponse {
  const successCount = results.length;
  const errorCount = errors.length;
  const message = buildResponseMessage(successCount, errorCount);

  const response: MediaResponse = {
    success: errorCount === 0,
    message,
    results,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return response;
}

/**
 * Format error messages from errors array
 */
function formatErrorMessages(
  errors: Array<{ fileName: string; error: string }>
): string {
  return errors.map((e) => `${e.fileName}: ${e.error}`).join('; ');
}

/**
 * Check if all uploads are complete and resolve/reject accordingly
 */
function checkAllUploadsComplete(
  completedCount: number,
  totalFiles: number,
  results: Media[],
  errors: Array<{ fileName: string; error: string }>,
  resolve: (value: MediaResponse) => void,
  reject: (reason?: any) => void
): void {
  if (completedCount !== totalFiles) {
    return;
  }

  const response = buildResponse(results, errors);

  if (errors.length === totalFiles) {
    const errorMessages = formatErrorMessages(errors);
    reject(new Error(`All uploads failed. ${errorMessages}`));
  } else {
    resolve(response);
  }
}

/**
 * Handle successful file upload
 */
function handleUploadSuccess(
  file: File,
  result: Media,
  results: Media[],
  completedCount: { value: number },
  totalFiles: number,
  errors: Array<{ fileName: string; error: string }>,
  resolve: (value: MediaResponse) => void,
  reject: (reason?: any) => void
): void {
  results.push(result);
  completedCount.value++;
  console.log(`✓ ${file.name} uploaded successfully`);

  checkAllUploadsComplete(
    completedCount.value,
    totalFiles,
    results,
    errors,
    resolve,
    reject
  );
}

/**
 * Handle failed file upload
 */
function handleUploadError(
  file: File,
  error: any,
  errors: Array<{ fileName: string; error: string }>,
  completedCount: { value: number },
  totalFiles: number,
  results: Media[],
  resolve: (value: MediaResponse) => void,
  reject: (reason?: any) => void
): void {
  const errorMessage = error?.message || `Failed to upload ${file.name}`;
  errors.push({
    fileName: file.name,
    error: errorMessage,
  });
  completedCount.value++;
  console.error(`✗ ${file.name} failed: ${errorMessage}`);

  checkAllUploadsComplete(
    completedCount.value,
    totalFiles,
    results,
    errors,
    resolve,
    reject
  );
}

/**
 * Start upload for a single file
 */
function startFileUpload(
  file: File,
  description: string | undefined,
  results: Media[],
  errors: Array<{ fileName: string; error: string }>,
  completedCount: { value: number },
  totalFiles: number,
  resolve: (value: MediaResponse) => void,
  reject: (reason?: any) => void
): void {
  MediaService.uploadFileScanner(file, { description })
    .then((result) => {
      handleUploadSuccess(
        file,
        result,
        results,
        completedCount,
        totalFiles,
        errors,
        resolve,
        reject
      );
    })
    .catch((error) => {
      handleUploadError(
        file,
        error,
        errors,
        completedCount,
        totalFiles,
        results,
        resolve,
        reject
      );
    });
}

/**
 * Upload all files concurrently
 */
function uploadAllFiles(
  filesArray: File[],
  description: string | undefined
): Promise<MediaResponse> {
  const results: Media[] = [];
  const errors: Array<{ fileName: string; error: string }> = [];
  const completedCount = { value: 0 };
  const totalFiles = filesArray.length;

  return new Promise<MediaResponse>((resolve, reject) => {
    filesArray.forEach((file) => {
      startFileUpload(
        file,
        description,
        results,
        errors,
        completedCount,
        totalFiles,
        resolve,
        reject
      );
    });
  });
}

export function useMedia(t: (key: string) => string) {
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle successful mutation response
   */
  const handleSuccessResponse = (data: MediaResponse) => {
    if (data.errors && data.errors.length > 0) {
      const errorMessages = data.errors
        .map((e) => `${e.fileName}: ${e.error}`)
        .join('\n');
      setError(`Some files failed to upload:\n${errorMessages}`);
    } else {
      setError(null);
    }
    console.log('Media upload result:', data);
  };

  /**
   * Handle mutation error
   */
  const handleErrorResponse = (error: any) => {
    setError(error?.message || 'An error occurred during file upload');
  };

  /**
   * Main mutation function to upload files
   */
  const uploadFiles = async (data: {
    files: FileList;
    description?: string;
  }): Promise<MediaResponse> => {
    const filesArray = Array.from(data.files);
    validateFiles(filesArray);
    return uploadAllFiles(filesArray, data.description);
  };

  const mediaMutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: handleSuccessResponse,
    onError: handleErrorResponse,
  });

  const schema = createMediaSchema(t);

  const form = useForm<MediaData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      files: undefined as unknown as FileList,
    },
  });

  const onSubmit = async (data: MediaData) => {
    setError(null);
    await mediaMutation.mutateAsync({
      files: data.files,
    });
  };

  const clearError = () => setError(null);

  return {
    form,
    error,
    isLoading: mediaMutation.isPending,
    onSubmit,
    clearError,
    response: mediaMutation.data,
  };
}
