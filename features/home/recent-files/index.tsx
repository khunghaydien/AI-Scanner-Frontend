'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box, Typography, CircularProgress, Checkbox } from '@mui/material';
import { FileActions } from './file-actions';
import FileRow from './file-row';
import { useCachedHandler } from './use-cached-handler.hook';
import { FilesService } from '@/services/files.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const ITEM_HEIGHT = 78; // 70px height + 8px gap
const FETCH_THRESHOLD = 100; // Fetch when 100px from bottom

export default function RecentFiles() {

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

  const { data: totalFilesCount, isLoading: isLoadingTotalFilesCount, isError: isErrorTotalFilesCount, error: errorTotalFilesCount } = useQuery({
    queryKey: ['files', 'total'],
    queryFn: () => FilesService.getTotalFilesCount(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const files = data?.pages.flatMap((page) => page.files) ?? [];
  const [checkedFiles, setCheckedFiles] = useState<Set<string>>(new Set());

  const virtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const checkedFilesList = useMemo(
    () => files.filter((file) => checkedFiles.has(file.id)),
    [files, checkedFiles]
  );

  const isAllChecked = useMemo(
    () => files.length > 0 && checkedFiles.size === files.length,
    [files.length, checkedFiles.size]
  );

  const isIndeterminate = useMemo(
    () => checkedFiles.size > 0 && checkedFiles.size < files.length,
    [checkedFiles.size, files.length]
  );

  const handleToggleCheck = useCallback((fileId: string) => {
    setCheckedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  }, []);

  const handleCheckAll = useCallback(() => {
    setCheckedFiles(
      checkedFiles.size === files.length
        ? new Set()
        : new Set(files.map((file) => file.id))
    );
  }, [checkedFiles.size, files]);

  const handleScroll = useCallback(() => {
    if (!parentRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < FETCH_THRESHOLD) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const fileIds = useMemo(() => files.map((f) => f.id), [files]);
  const getToggleHandler = useCachedHandler(
    useCallback((fileId: string) => () => handleToggleCheck(fileId), [handleToggleCheck]),
    fileIds
  );

  if (isLoading && files.length === 0) {
    return (
      <Box className="flex items-center justify-center p-8">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-4">
        <Typography color="error">
          {error?.message || 'Không thể tải danh sách files'}
        </Typography>
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box className="p-4">
        <Typography className="text-muted-foreground">Chưa có files nào</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box className="space-y-4">
        <Box className="flex items-center justify-between">
          <Typography variant="h6">Total Files: {totalFilesCount}</Typography>
          <Box className="flex items-center gap-2">
            <Typography variant="body1">
              Selected files: {checkedFiles.size}
            </Typography>
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleCheckAll}
            />
          </Box>
        </Box>

        <Box
          ref={parentRef}
          onScroll={handleScroll}
          className="overflow-auto"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <Box
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const file = files[virtualItem.index];
              return (
                <Box
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <FileRow
                    file={file}
                    isChecked={checkedFiles.has(file.id)}
                    onToggleCheck={getToggleHandler(file.id)}
                  />
                </Box>
              );
            })}
          </Box>

          {isFetchingNextPage && (
            <Box className="flex items-center justify-center p-4">
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Box>

      {checkedFiles.size > 0 && <FileActions checkedFiles={checkedFilesList} />}
    </>
  );
}