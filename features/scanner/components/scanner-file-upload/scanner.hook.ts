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
 * Chunk array into groups of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Upload a single file
 */
async function uploadSingleFile(
  file: File,
  description: string | undefined
): Promise<{ file: File; result: Media }> {
  const result = await MediaService.uploadFileScanerColor(file, { description });
  return { file, result };
}

/**
 * Upload a chunk of files concurrently
 */
async function uploadChunk(
  chunk: File[],
  description: string | undefined
): Promise<Array<{ file: File; result: Media } | { file: File; error: string }>> {
  const uploadPromises = chunk.map((file) =>
    uploadSingleFile(file, description).catch((error) => ({
      file,
      error: error?.message || `Failed to upload ${file.name}`,
    }))
  );

  return Promise.all(uploadPromises);
}

/**
 * Upload all files with chunking and parallel processing
 * - Chunks files into groups of 10
 * - Uploads up to 10 chunks concurrently (100 files max at once)
 * - Each chunk processes 10 files in parallel
 */
async function uploadAllFiles(
  filesArray: File[],
  description: string | undefined
): Promise<MediaResponse> {
  const CHUNK_SIZE = 10; // 10 files per chunk
  const MAX_CONCURRENT_CHUNKS = 10; // Process 10 chunks at once (100 files max)

  const results: Media[] = [];
  const errors: Array<{ fileName: string; error: string }> = [];

  // Chunk files into groups of 10
  const chunks = chunkArray(filesArray, CHUNK_SIZE);
  console.log(`📦 Split ${filesArray.length} files into ${chunks.length} chunks`);

  // Process chunks in batches (10 chunks at a time)
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_CHUNKS) {
    const chunkBatch = chunks.slice(i, i + MAX_CONCURRENT_CHUNKS);
    console.log(
      `🚀 Processing chunks ${i + 1}-${Math.min(i + MAX_CONCURRENT_CHUNKS, chunks.length)} (${chunkBatch.length} chunks, ~${chunkBatch.reduce((sum, chunk) => sum + chunk.length, 0)} files)`
    );

    // Process all chunks in this batch concurrently
    const chunkResults = await Promise.all(
      chunkBatch.map((chunk) => uploadChunk(chunk, description))
    );

    // Flatten results and separate successes from errors
    for (const chunkResult of chunkResults) {
      for (const item of chunkResult) {
        if ('result' in item) {
          results.push(item.result);
          console.log(`✓ ${item.file.name} uploaded successfully`);
        } else {
          errors.push({
            fileName: item.file.name,
            error: item.error,
          });
          console.error(`✗ ${item.file.name} failed: ${item.error}`);
        }
      }
    }

    console.log(
      `✅ Batch ${Math.floor(i / MAX_CONCURRENT_CHUNKS) + 1} completed: ${results.length} success, ${errors.length} errors`
    );
  }

  return buildResponse(results, errors);
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
