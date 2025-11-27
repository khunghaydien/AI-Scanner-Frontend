'use client';

import { useCallback, useRef, useState } from 'react';
import { Box } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { FilesService } from '@/services/files.service';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import clsx from 'clsx';

interface AddImageProps {
    onAddSuccess?: () => void;
}

export default function AddImage({ onAddSuccess }: AddImageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();
    const { fileId } = useParams();

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0 || !fileId) return;

            try {
                setIsUploading(true);

                // Filter chỉ lấy file ảnh
                const imageFiles = Array.from(files).filter((file) =>
                    file.type.startsWith('image/')
                );

                if (imageFiles.length === 0) {
                    return;
                }

                // Thêm ảnh vào file
                await FilesService.addImagesToFile(fileId as string, imageFiles);

                // Refetch lại file detail
                await queryClient.invalidateQueries({ queryKey: ['file', fileId] });


                if (onAddSuccess) {
                    onAddSuccess();
                }
            } catch (error: any) {
                console.error('Add images error:', error);
                setIsUploading(false);
                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        },
        [fileId, queryClient, onAddSuccess]
    );

    return (
        <>
            <Box
                onClick={handleClick}
                className={clsx(
                    'border-2 border-dashed border-border bg-muted/50 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer transition-colors',
                    isUploading && 'opacity-50 cursor-not-allowed'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isUploading) {
                            handleClick();
                        }
                    }
                }}
            >
                <AddAPhotoIcon
                    className={clsx(
                        'h-8 w-8',
                        isUploading ? 'text-muted-foreground' : 'text-foreground'
                    )}
                />
                <span
                    className={clsx(
                        'font-bold',
                        isUploading ? 'text-muted-foreground' : 'text-foreground'
                    )}
                >
                    {isUploading ? 'Đang thêm...' : 'Thêm'}
                </span>
            </Box>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </>
    );
}
