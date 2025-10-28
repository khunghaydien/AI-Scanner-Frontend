'use client';

import React, { memo } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslations } from 'next-intl';

interface DragDropZoneContentProps {
  isDragging: boolean;
}

export const DragDropZoneContent: React.FC<DragDropZoneContentProps> = memo(({ isDragging }) => {
  const t = useTranslations();

  return (
    <Box className="relative">
      {isDragging ? (
        <Fade in={isDragging}>
          <Box>
            <CloudUploadIcon className="text-[64px] text-primary animate-pulse" />
            <Typography variant="h6" color="primary" className="mt-4">
              {t('file_input_drop_here')}
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Box>
          <CloudUploadIcon className="text-[48px] text-muted-foreground" />
          <Typography variant="body1" className="mt-2 font-medium">
            {t('file_input_drag_drop')}
          </Typography>
          <Typography variant="caption" color="text.secondary" className="mt-2 block">
            {t('file_input_multiple_files')}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

DragDropZoneContent.displayName = 'DragDropZoneContent';
