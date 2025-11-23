import { useMutation } from '@tanstack/react-query';
import { FilesService } from '@/services/files.service';

interface UseUploadFilesReturn {
  uploadFiles: (files: File[]) => Promise<any>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: any | undefined;
}

export function useUploadFiles(): UseUploadFilesReturn {
  const mutation = useMutation<any, Error, File[]>({
    mutationFn: async (files: File[]) => {
      return await FilesService.uploadFiles(files);
    },
  });

  return {
    uploadFiles: async (files: File[]) => {
      return await mutation.mutateAsync(files);
    },
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

