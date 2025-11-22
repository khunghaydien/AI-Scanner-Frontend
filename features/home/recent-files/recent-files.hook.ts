'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { FilesService } from '@/services/files.service';

export interface FileItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrl?: string;
}

interface FilesResponse {
  files: FileItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

export function useRecentFiles() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<FilesResponse>({
    queryKey: ['files', 'recent'],
    queryFn: async ({ pageParam }) => {
      const response = await FilesService.getFiles(pageParam as string | null | undefined);
      return {
        files: response.files || [],
        hasMore: response.hasMore || false,
        nextCursor: response.nextCursor || null,
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Flatten all pages into a single array
  const files = data?.pages.flatMap((page) => page.files) || [];

  return {
    files,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}

