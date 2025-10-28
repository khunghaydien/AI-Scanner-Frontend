'use client';

import React, { Suspense, lazy } from 'react';
import { Box, Typography } from '@mui/material';
import { useFileInput } from './use-file-input.hook';
import { DragDropZone } from './drag-drop-zone';
import { DragDropZoneContent } from './drag-drop-zone-content';
import { FileItem } from './file-item';

// Lazy load preview modal - only load when needed
const FilePreview = lazy(() =>
  import('../file-preview/index').then((module) => ({ default: module.FilePreview }))
);

export interface FileInputProps {
  name: string;
  disabled?: boolean;
  accept?: string;
  error?: string;
  value?: FileList | File[] | null;
  onChange?: (files: FileList | null) => void;
  onBlur?: () => void;
  ref?: any;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ name, disabled = false, accept, error, value, onChange, onBlur, ...rest }, ref) => {
    const {
      files,
      isDragging,
      previewModalOpen,
      previewFile,
      previewUrls,
      docHtmls,
      inputRef,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      handleRemoveFile,
      handleClick,
      handleOpenPreview,
      handleClosePreview,
      computeFlags,
    } = useFileInput({ disabled, accept, value, onChange });

    return (
      <Box>
        <DragDropZone
          disabled={disabled}
          isDragging={isDragging}
          error={error}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={name}
            name={name}
            ref={(e) => {
              // @ts-ignore - inputRef is mutable
              inputRef.current = e;
              // Forward ref to parent
              if (typeof ref === 'function') {
                ref(e);
              } else if (ref && typeof ref === 'object') {
                try {
                  // @ts-ignore - readonly ref workaround
                  (ref as any).current = e;
                } catch (err) {
                  // Ignore readonly ref errors
                }
              }
            }}
            multiple
            accept={accept}
            disabled={disabled}
            className="hidden"
            onChange={handleFileChange}
            onBlur={onBlur}
            {...rest}
          />
          <DragDropZoneContent isDragging={isDragging} />
        </DragDropZone>

        {error && (
          <Typography variant="caption" color="error" className="mt-1 block ml-2">
            {error}
          </Typography>
        )}

        {files.length > 0 && (
          <Box className="mt-4 h-full w-full overflow-y-auto scrollbar-hide max-h-[424px]">
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg">
              {files.map((file, index) => {
                const flags = computeFlags(file);
                const previewUrl = previewUrls[index];
                const docHtml = docHtmls[index];

                return (
                  <FileItem
                    key={`${file.name}-${file.size}-${index}`}
                    file={file}
                    previewUrl={previewUrl}
                    docHtml={docHtml}
                    flags={flags}
                    onPreview={() => handleOpenPreview(index)}
                    onRemove={() => handleRemoveFile(index)}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {previewModalOpen && previewFile && (
          <Suspense
            fallback={
              <Box className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Typography variant="body1" className="text-white">
                  Loading preview...
                </Typography>
              </Box>
            }
          >
            <FilePreview
              open
              onClose={handleClosePreview}
              file={previewFile}
              previewUrl={previewUrls[files.findIndex((f) => f === previewFile)] || null}
            />
          </Suspense>
        )}
      </Box>
    );
  }
);

FileInput.displayName = 'FileInput';
