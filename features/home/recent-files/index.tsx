'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRecentFiles } from './recent-files.hook';
import { Box, Typography, CircularProgress, Checkbox } from '@mui/material';
import { FileItem } from './recent-files.hook';
import { formatDateTime } from './utils';
import { FileActions } from './file-actions';
import Image from 'next/image';
import ImageIcon from '@mui/icons-material/Image';
export default function RecentFiles() {
  const { files, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useRecentFiles();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [checkedFiles, setCheckedFiles] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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
          <Typography variant="h6">
            Recent Files
          </Typography>
          <Box className="flex items-center gap-2">
            <Typography variant="body1">
              {checkedFiles.size}/{files.length}
            </Typography>
            <Checkbox
              checked={files.length > 0 && checkedFiles.size === files.length}
              indeterminate={checkedFiles.size > 0 && checkedFiles.size < files.length}
              onChange={handleCheckAll}
            />
          </Box>
        </Box>
        <Box className="space-y-2">
          {files.map((file: FileItem) => {
            const imageUrl = file.thumbnailUrl || file.previewUrl || file.fileUrl;
            const hasImageError = imageErrors.has(file.id);
            const isImage = file.mimeType.startsWith('image/');

            return (
              <Box
                key={file.id}
                className="group items-center flex gap-2"
              >
                {isImage && !hasImageError ? (
                  <Image
                    src={imageUrl}
                    alt={file.fileName}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-lg"
                    unoptimized
                    onError={() => {
                      setImageErrors((prev) => new Set(prev).add(file.id));
                    }}
                  />
                ) : (
                  <div className="w-[70px] h-[70px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-lg bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="items-center flex gap-4 flex-1 min-w-0 h-[70px] pl-2 bg-muted/50 rounded-lg">
                  {/* File info */}
                  <Box className="flex-1 min-w-0">
                    <Typography variant="body1" className="font-medium truncate">
                      {file.fileName}
                    </Typography>
                    <Typography variant="caption" className="text-muted-foreground">
                      {formatDateTime(file.updatedAt)}
                    </Typography>
                  </Box>

                  {/* Checkbox */}
                  <div className="flex items-center justify-center">
                    <Checkbox
                      className="h-fit"
                      checked={checkedFiles.has(file.id)}
                      onChange={() => handleToggleCheck(file.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

              </Box>
            );
          })}
        </Box>

        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <Box ref={observerTarget} className="flex items-center justify-center p-4">
            {isFetchingNextPage && <CircularProgress size={24} />}
          </Box>
        )}
      </Box>
      {
        checkedFiles.size > 0 && (
          <FileActions
            checkedFiles={files.filter((file: FileItem) => checkedFiles.has(file.id))}
          />
        )
      }
    </>
  );
}