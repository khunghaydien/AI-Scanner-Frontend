'use client';

import { memo, useMemo, useCallback, useRef } from "react";
import { CommonButton } from "@/components/ui/button";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import CameraIcon from '@mui/icons-material/Camera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useUploadFiles } from './upload-files.hook';
import { useQueryClient } from '@tanstack/react-query';

interface UploadFileActionProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    stream: MediaStream | null;
    onCloseDialog: () => void;
    onStopCamera: () => void;
    onMore?: () => void;
}

function UploadFileActionComponent({
    videoRef,
    canvasRef,
    stream,
    onCloseDialog,
    onStopCamera,
    onMore,
}: UploadFileActionProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const { uploadFiles: uploadFilesMutation, isLoading } = useUploadFiles();
    const queryClient = useQueryClient();
    const hasStream = !!stream;

    // Function chung để xử lý upload files - chỉ chấp nhận ảnh
    const handleUploadFiles = useCallback(
        async (files: File[], successMessage: string = 'Upload ảnh thành công!') => {
            try {
                // Filter chỉ lấy file ảnh
                const imageFiles = files.filter((file) => file.type.startsWith('image/'));
                
                if (imageFiles.length === 0) {
                    return;
                }

                // Đóng dialog trước
                onCloseDialog();
                
                // Stop camera nếu đang chạy
                onStopCamera();

                // Upload files
                await uploadFilesMutation(imageFiles);

                // Refetch lại danh sách files
                await queryClient.invalidateQueries({ queryKey: ['files', 'recent'] });

            } catch (error) {
                console.error('Upload error:', error);
            }
        },
        [uploadFilesMutation, queryClient, onCloseDialog, onStopCamera]
    );

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
    }, [handleUploadFiles, videoRef, canvasRef]);

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

    const handleMore = useCallback(() => {
        if (onMore) {
            onMore();
        } else {
            console.log('More actions');
            // TODO: Implement more actions menu
        }
    }, [onMore]);

    const buttons = useMemo(() => [
        {
            icon: (
                <IconButton
                    aria-label="More"
                    disabled={isLoading}
                    className={clsx(isLoading && 'opacity-50 cursor-not-allowed')}
                >
                    <MoreVertIcon className={clsx("h-6 w-6", isLoading ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            label: 'Khác',
            onClick: handleMore,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Capture Photo"
                    disabled={isLoading || !hasStream}
                    className={clsx((isLoading || !hasStream) && 'opacity-50 cursor-not-allowed')}
                >
                    <CameraIcon className={clsx("h-6 w-6", (isLoading || !hasStream) ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            label: 'Chụp ảnh',
            onClick: capturePhoto,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Upload Image"
                    disabled={isLoading}
                    className={clsx(isLoading && 'opacity-50 cursor-not-allowed')}
                >
                    <PhotoLibraryIcon className={clsx("h-6 w-6", isLoading ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            label: 'Tải ảnh',
            onClick: handleSelectImage,
            visible: true,
        },
    ], [isLoading, hasStream, handleMore, capturePhoto, handleSelectImage]);

    const visibleButtons = useMemo(
        () => buttons.filter(button => button.visible !== false),
        [buttons]
    );

    return (
        <Box
            component="footer"
            className="h-16 fixed bottom-0 left-0 right-0 z-[60] border-t border-border bg-background flex items-center justify-center"
        >
            {visibleButtons.map((button, index) => (
                <CommonButton
                    key={`${button.label}-${index}`}
                    icon={button.icon}
                    onClick={button.onClick}
                    label={button.label}
                    className="flex-1"
                />
            ))}
            {/* Hidden file input - chỉ chấp nhận image files */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
            />
        </Box>
    );
}

export default memo(UploadFileActionComponent);
