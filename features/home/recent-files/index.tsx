'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRecentFiles } from './recent-files.hook';
import { Box, Typography, CircularProgress, Checkbox } from '@mui/material';
import { FileActions } from './file-actions';
import FileRow from './file-row';
import { useCachedHandler } from './use-cached-handler.hook';

const ITEM_HEIGHT = 78; // 70px height + 8px gap
const FETCH_THRESHOLD = 100; // Fetch when 100px from bottom

export default function RecentFiles() {
  const { files, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useRecentFiles();
  const parentRef = useRef<HTMLDivElement>(null);
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
          <Typography variant="h6">Recent Files</Typography>
          <Box className="flex items-center gap-2">
            <Typography variant="body1">
              {checkedFiles.size}/{files.length}
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