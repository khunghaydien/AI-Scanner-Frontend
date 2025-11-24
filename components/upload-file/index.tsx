'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Box, IconButton, Dialog, DialogContent, Button } from '@mui/material';
import { IconCamera } from '@/components/icons';
import { useUploadFiles } from './upload-files.hook';
import { useQueryClient } from '@tanstack/react-query';
import CameraIcon from '@mui/icons-material/Camera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';

export default function UploadFile() {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean | null; hasMoved: boolean; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const { uploadFiles: uploadFilesMutation, isLoading } = useUploadFiles();
  const queryClient = useQueryClient();

  // Load saved position from localStorage
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upload-button-position');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return { bottom: 80, right: 16 };
  });

  // Function chung để xử lý upload files
  const handleUploadFiles = useCallback(
    async (files: File[], successMessage: string = 'Upload thành công!') => {
      try {
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
        await uploadFilesMutation(files);

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

  const handleSelectDocument = useCallback(() => {
    documentInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleUploadFiles(Array.from(files), 'Upload ảnh thành công!');
        // Reset input
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    },
    [handleUploadFiles]
  );

  const handleDocumentChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleUploadFiles(Array.from(files), 'Upload file thành công!');
        // Reset input
        if (documentInputRef.current) {
          documentInputRef.current.value = '';
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

  // Helper function to initialize drag state
  const initDragState = useCallback((clientX: number, clientY: number) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragRef.current = {
        isDragging: null as boolean | null, // null = not started, true = dragging, false = stopped
        hasMoved: false,
        startX: clientX,
        startY: clientY,
        offsetX: clientX - rect.left,
        offsetY: clientY - rect.top,
      };
    }
  }, []);

  // Drag handlers for mouse
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    initDragState(e.clientX, e.clientY);
  }, [initDragState]);

  // Drag handlers for touch
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // Don't preventDefault here - allow normal scrolling if user is not dragging button
    const touch = e.touches[0];
    if (touch) {
      initDragState(touch.clientX, touch.clientY);
    }
  }, [initDragState]);

  // Helper function to update position based on client coordinates
  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current || !buttonRef.current) {
      return;
    }
    
    // If isDragging is explicitly false (was set by mouseup/touchend), don't update
    // This prevents button from following mouse/touch after release
    if (dragRef.current.isDragging === false) {
      return;
    }
    
    const moveThreshold = 5; // pixels
    const deltaX = Math.abs(clientX - dragRef.current.startX);
    const deltaY = Math.abs(clientY - dragRef.current.startY);
    
    // If moved more than threshold, consider it a drag
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      // Set dragging flag when movement detected
      dragRef.current.isDragging = true;
      dragRef.current.hasMoved = true;
      
      const buttonWidth = buttonRef.current.offsetWidth;
      const buttonHeight = buttonRef.current.offsetHeight;
      
      // Calculate new position: client position minus the offset from when drag started
      const newX = clientX - dragRef.current.offsetX;
      const newY = clientY - dragRef.current.offsetY;
      
      // Convert to bottom/right coordinates
      const newRight = window.innerWidth - newX - buttonWidth;
      const newBottom = window.innerHeight - newY - buttonHeight;
      
      // Constrain to viewport with padding
      const padding = 16;
      const constrainedRight = Math.max(padding, Math.min(newRight, window.innerWidth - buttonWidth - padding));
      const constrainedBottom = Math.max(padding, Math.min(newBottom, window.innerHeight - buttonHeight - padding));
      
      setPosition({ bottom: constrainedBottom, right: constrainedRight });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Only preventDefault if we're actually dragging the button
    // This allows normal scrolling when not dragging
    if (!dragRef.current || !buttonRef.current) {
      // No drag in progress, allow normal scroll
      return;
    }
    
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    
    // Check if we're dragging (has moved beyond threshold)
    const moveThreshold = 5;
    const deltaX = Math.abs(touch.clientX - dragRef.current.startX);
    const deltaY = Math.abs(touch.clientY - dragRef.current.startY);
    const isDragging = dragRef.current.isDragging === true || deltaX > moveThreshold || deltaY > moveThreshold;
    
    // Only preventDefault and update position if we're actually dragging the button
    if (isDragging) {
      e.preventDefault();
      updatePosition(touch.clientX, touch.clientY);
    }
    // If not dragging, allow normal scroll behavior (don't preventDefault)
  }, [updatePosition]);

  // Helper function to handle drag end
  const handleDragEnd = useCallback(() => {
    if (dragRef.current) {
      const wasDragging = dragRef.current.isDragging;
      const hasMoved = dragRef.current.hasMoved;
      
      // Stop dragging immediately - this prevents handleMouseMove/handleTouchMove from updating position
      dragRef.current.isDragging = false;
      
      // Save position to localStorage if dragged
      if (wasDragging && hasMoved && typeof window !== 'undefined' && buttonRef.current) {
        // Get current position from state (it's already updated by handleMouseMove/handleTouchMove)
        const currentPosition = position;
        localStorage.setItem('upload-button-position', JSON.stringify(currentPosition));
      }
      
      // Reset hasMoved after a short delay to prevent onClick
      if (hasMoved) {
        setTimeout(() => {
          if (dragRef.current) {
            dragRef.current.hasMoved = false;
          }
        }, 100);
      } else {
        dragRef.current.hasMoved = false;
      }
    }
  }, [position]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Add global mouse and touch event listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mouse events for desktop
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Touch events for mobile
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <>
      {/* Camera Icon Button */}
      <Box
        ref={buttonRef}
        className="fixed z-50 bg-primary rounded-full p-2 cursor-move hover:bg-primary/90 transition-colors select-none"
        style={{
          bottom: `${position.bottom}px`,
          right: `${position.right}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={(e) => {
          // Check if this was a drag operation (only check hasMoved, not isDragging)
          const wasDrag = dragRef.current?.hasMoved;
          
          if (wasDrag) {
            // Prevent click if was dragging
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          
          // Only open dialog if it was a genuine click (no drag)
          handleOpen();
        }}
        onTouchEnd={(e) => {
          // Check if this was a drag operation (only check hasMoved, not isDragging)
          const wasDrag = dragRef.current?.hasMoved;
          
          if (wasDrag) {
            // Prevent click if was dragging
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          
          // Only open dialog if it was a genuine tap (no drag)
          handleOpen();
        }}
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

            {/* Nhập tin */}
            <IconButton
              onClick={handleSelectDocument}
              className="text-white"
              aria-label="Input Document"
            >
              <DescriptionIcon />
            </IconButton>
          </Box>

          {/* Hidden file inputs */}
          {/* Input cho ảnh - chỉ chấp nhận image files */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
          {/* Input cho documents - không chấp nhận image files */}
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.csv"
            multiple
            className="hidden"
            onChange={handleDocumentChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
