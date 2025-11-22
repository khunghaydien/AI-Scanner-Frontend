'use client';

import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';

interface FileThumbnailProps {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  className?: string;
}

export function FileThumbnail({ 
  fileUrl, 
  fileName, 
  mimeType, 
  thumbnailUrl,
  previewUrl,
  className = '' 
}: FileThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Xác định loại file
  const isImage = mimeType?.startsWith('image/');
  const isPdf = mimeType?.includes('pdf') || mimeType === 'application/pdf';
  const isDocument = mimeType?.includes('word') || 
                     mimeType?.includes('document') || 
                     mimeType?.includes('msword') ||
                     mimeType?.includes('officedocument') ||
                     mimeType?.includes('text/plain');

  // URL để hiển thị - ưu tiên thumbnailUrl > previewUrl > fileUrl
  const displayUrl = thumbnailUrl || previewUrl || fileUrl;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  // Hiển thị theo loại file giống như file-item.tsx
  return (
    <Box className={`w-full h-full flex items-center justify-center bg-background relative overflow-hidden ${className}`}>
      {/* Image files - hiển thị như background image */}
      {isImage && !imageError && (
        <Box
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${displayUrl})` }}
        />
      )}

      {/* PDF files - hiển thị bằng iframe */}
      {isPdf && !iframeError && displayUrl && (
        <iframe
          src={displayUrl}
          className="w-full h-full border-0 pointer-events-none"
          onError={handleIframeError}
          style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}
        />
      )}

      {/* Document files - thử hiển thị bằng iframe hoặc fallback */}
      {isDocument && !iframeError && displayUrl && (
        <iframe
          src={displayUrl}
          className="w-full h-full border-0 pointer-events-none"
          onError={handleIframeError}
          style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}
        />
      )}

      {/* Fallback icons khi không load được */}
      {(imageError || iframeError || (!isImage && !isPdf && !isDocument)) && (
        <Box className="w-full h-full flex items-center justify-center bg-muted/50">
          {isPdf ? (
            <InsertDriveFileIcon className="w-12 h-12 text-muted-foreground" />
          ) : isDocument ? (
            <DescriptionIcon className="w-12 h-12 text-muted-foreground" />
          ) : (
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          )}
        </Box>
      )}
    </Box>
  );
}

