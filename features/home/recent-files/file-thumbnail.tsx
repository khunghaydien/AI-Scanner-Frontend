'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

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

  // Xác định loại file
  const isImage = mimeType?.startsWith('image/');

  // URL để hiển thị - chỉ dùng thumbnailUrl cho ảnh
  const displayUrl = thumbnailUrl || previewUrl || fileUrl;

  const handleImageError = () => {
    setImageError(true);
  };

  // Hiển thị ảnh
  return (
    <Box className={`w-full h-full flex items-center justify-center bg-background relative overflow-hidden ${className}`}>
      {/* Image files - hiển thị như background image */}
      {isImage && !imageError && (
        <Box
          component="img"
          src={displayUrl}
          alt={fileName}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          onError={handleImageError}
        />
      )}

      {/* Fallback icon khi không load được hoặc không phải ảnh */}
      {(imageError || !isImage) && (
        <Box className="w-full h-full flex items-center justify-center bg-muted/50">
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        </Box>
      )}
    </Box>
  );
}

