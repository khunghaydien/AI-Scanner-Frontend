'use client';

import React, { memo } from 'react';
import { Box, IconButton, Zoom } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface FileItemProps {
  file: File;
  previewUrl?: string;
  docHtml?: string;
  flags: {
    isImage: boolean;
    isPdf: boolean;
    isWord: boolean;
    isTxt: boolean;
  };
  onPreview: () => void;
  onRemove: () => void;
}

export const FileItem: React.FC<FileItemProps> = memo(
  ({ file, previewUrl, docHtml, flags, onPreview, onRemove }) => {
    return (
      <Zoom in={true}>
        <Box className="relative w-full h-[200px] overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary group shadow-md shadow-muted-foreground">
          <Box
            className={`file-preview w-full h-full flex items-center justify-center bg-background relative transition-transform duration-300 group-hover:scale-110 ${
              flags.isImage && previewUrl ? 'bg-cover bg-center' : ''
            }`}
            style={
              flags.isImage && previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined
            }
          >
            {flags.isPdf && previewUrl && (
              <iframe src={previewUrl} className="w-full h-full border-0 pointer-events-none" />
            )}
            {(flags.isWord || flags.isTxt) && docHtml && (
              <>
                <style>{`
                                .doc-preview-grid * { color: inherit !important; }
                                .doc-preview-grid p, .doc-preview-grid span, .doc-preview-grid div { 
                                    color: inherit !important; 
                                    font-size: 8px !important;
                                    line-height: 1.2 !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }
                            `}</style>
                <Box
                  className="doc-preview-grid w-full h-full overflow-auto p-1 bg-background text-foreground text-[8px]"
                  dangerouslySetInnerHTML={{ __html: docHtml }}
                />
              </>
            )}
          </Box>

          <Box className="overlay absolute inset-0 bg-black/60 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="hover:scale-110 transition-all !bg-muted"
            >
              <VisibilityIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="hover:scale-110 transition-all !bg-muted"
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>

          <Box className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-1 text-center overflow-hidden text-ellipsis whitespace-nowrap">
            {file.name}
          </Box>
        </Box>
      </Zoom>
    );
  }
);

FileItem.displayName = 'FileItem';
