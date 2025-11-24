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

export function useRecentFiles() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['files', 'recent'],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      return FilesService.getFiles({
        cursor: pageParam ?? undefined,
        limit: 10,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    files: data?.pages.flatMap((page) => page.files) ?? [],
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

