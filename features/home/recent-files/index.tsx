'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRecentFiles } from './recent-files.hook';
import { Box, Typography, CircularProgress, Checkbox, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { FileItem } from './recent-files.hook';
import { formatDateTime } from './utils';
import { FileThumbnail } from './file-thumbnail';
import CloseIcon from '@mui/icons-material/Close';

export default function RecentFiles() {
  const { files, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useRecentFiles();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [checkedFiles, setCheckedFiles] = useState<Set<string>>(new Set());

  // Infinite scroll handler
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleToggleCheck = useCallback((fileId: string) => {
    setCheckedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  const handleCheckAll = useCallback(() => {
    if (checkedFiles.size === files.length) {
      // Uncheck all
      setCheckedFiles(new Set());
    } else {
      // Check all
      setCheckedFiles(new Set(files.map((file) => file.id)));
    }
  }, [checkedFiles.size, files]);

  const showModal = checkedFiles.size > 0;

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
      <Box className="w-full">
        <Typography variant="h6" className="mb-4">
          Recent Files
        </Typography>
        <Box className="space-y-2">
          {files.map((file: FileItem) => (
            <Box
              key={file.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-4"
            >
              {/* Image thumbnail - 100x100px */}
              <Box className="w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <FileThumbnail
                  fileUrl={file.fileUrl}
                  fileName={file.fileName}
                  mimeType={file.mimeType}
                  thumbnailUrl={file.thumbnailUrl}
                  previewUrl={file.previewUrl}
                />
              </Box>

              {/* File info */}
              <Box className="flex-1 min-w-0">
                <Typography variant="body1" className="font-medium truncate">
                  {file.fileName}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {formatDateTime(file.createdAt)}
                </Typography>
              </Box>

              {/* Checkbox */}
              <Checkbox
                checked={checkedFiles.has(file.id)}
                onChange={() => handleToggleCheck(file.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          ))}
        </Box>
        
        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <Box ref={observerTarget} className="flex items-center justify-center p-4">
            {isFetchingNextPage && <CircularProgress size={24} />}
          </Box>
        )}
      </Box>

      {/* Modal khi có file được check */}
      <Dialog
        open={showModal}
        onClose={() => setCheckedFiles(new Set())}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex items-center justify-between">
          <Typography variant="h6">Selected Files ({checkedFiles.size})</Typography>
          <IconButton onClick={() => setCheckedFiles(new Set())} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Check all */}
          <Box className="mb-4 pb-4 border-b border-border">
            <Box className="flex items-center gap-2">
              <Checkbox
                checked={checkedFiles.size === files.length && files.length > 0}
                indeterminate={checkedFiles.size > 0 && checkedFiles.size < files.length}
                onChange={handleCheckAll}
              />
              <Typography variant="body1" className="font-medium">
                Check All
              </Typography>
            </Box>
          </Box>

          {/* List all files */}
          <Box className="space-y-2 max-h-[60vh] overflow-y-auto">
            {files.map((file: FileItem) => (
              <Box
                key={file.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-4"
              >
                {/* Image thumbnail */}
                <Box className="w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <FileThumbnail
                    fileUrl={file.fileUrl}
                    fileName={file.fileName}
                    mimeType={file.mimeType}
                    thumbnailUrl={file.thumbnailUrl}
                    previewUrl={file.previewUrl}
                  />
                </Box>

                {/* File info */}
                <Box className="flex-1 min-w-0">
                  <Typography variant="body1" className="font-medium truncate">
                    {file.fileName}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    {formatDateTime(file.createdAt)}
                  </Typography>
                </Box>

                {/* Checkbox */}
                <Checkbox
                  checked={checkedFiles.has(file.id)}
                  onChange={() => handleToggleCheck(file.id)}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}