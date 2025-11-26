'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Box, IconButton, Dialog, DialogContent, Button } from '@mui/material';
import { IconCamera } from '@/components/icons';
import { useUploadFiles } from './upload-files.hook';
import { useQueryClient } from '@tanstack/react-query';
import CameraIcon from '@mui/icons-material/Camera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';

export default function UploadFile() {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles: uploadFilesMutation, isLoading } = useUploadFiles();
  const queryClient = useQueryClient();

  // Function chung để xử lý upload files - chỉ chấp nhận ảnh
  const handleUploadFiles = useCallback(
    async (files: File[], successMessage: string = 'Upload ảnh thành công!') => {
      try {
        // Filter chỉ lấy file ảnh
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
          alert('Vui lòng chọn file ảnh!');
          return;
        }

        if (imageFiles.length < files.length) {
          alert(`Đã bỏ qua ${files.length - imageFiles.length} file không phải ảnh.`);
        }

        // Đóng dialog trước
        setIsOpen(false);
        
        // Stop camera nếu đang chạy
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        // Upload files
        await uploadFilesMutation(imageFiles);

        // Refetch lại danh sách files
        await queryClient.invalidateQueries({ queryKey: ['files', 'recent'] });

        alert(successMessage);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload thất bại. Vui lòng thử lại.');
      }
    },
    [uploadFilesMutation, queryClient, stream, setStream]
  );

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await handleUploadFiles([file], 'Upload ảnh thành công!');
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [handleUploadFiles]);

  const handleSelectImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleUploadFiles(Array.from(files));
        // Reset input
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    },
    [handleUploadFiles]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    setIsOpen(false);
  }, [stopCamera]);

  return (
    <>
      {/* Camera Icon Button */}
      <Box
        className="fixed bottom-20 right-12 z-50 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors select-none"
        onClick={handleOpen}
        aria-label="Upload File"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <IconCamera className="h-6 w-6 text-white pointer-events-none" />
      </Box>

      {/* Camera Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            margin: 0,
            maxWidth: '100%',
            maxHeight: '100%',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Video Preview */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>

          {/* Bottom Controls */}
          <Box className="fixed bottom-0 left-0 right-0 bg-background/60 backdrop-blur-md border-t border-border/50 p-4 flex items-center justify-between z-50">
            {/* Tính năng */}
            <IconButton
              onClick={() => {
                // TODO: Implement features menu
                alert('Tính năng đang phát triển');
              }}
              className="text-white"
              aria-label="Features"
            >
              <SettingsIcon />
            </IconButton>

            {/* Chụp ảnh */}
            <Button
              onClick={capturePhoto}
              disabled={isLoading || !stream}
              className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
              aria-label="Capture"
            >
              <CameraIcon className="text-2xl" />
            </Button>

            {/* Nhập ảnh */}
            <IconButton
              onClick={handleSelectImage}
              className="text-white"
              aria-label="Select Image"
            >
              <PhotoLibraryIcon />
            </IconButton>
          </Box>

          {/* Hidden file input - chỉ chấp nhận image files */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
