'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import { IconCamera } from '@/components/icons';
import UploadFileAction from './upload-file-action';

export default function UploadFile() {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          <UploadFileAction
            videoRef={videoRef}
            canvasRef={canvasRef}
            stream={stream}
            onCloseDialog={() => setIsOpen(false)}
            onStopCamera={stopCamera}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
