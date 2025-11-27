'use client';

import { memo, useMemo, useCallback } from "react";
import { CommonButton } from "@/components/ui/button";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FileResponse, FilesService } from "@/services/files.service";

interface FileDetailFooterProps {
    file: FileResponse | undefined;
}

function FileDetailFooterComponent({
    file,
}: FileDetailFooterProps) {
    const hasFile = !!file;


    const handleToScan = useCallback(async () => {
        if (!file) {
            return;
        }

        try {
            const result = await FilesService.convertToScan(file.id);
            if (result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Convert to scan error:', error);
            alert(error?.message || 'Chuyển đổi sang scanned PDF thất bại. Vui lòng thử lại.');
        }
    }, [file]);

    const handleToPdf = useCallback(async () => {
        if (!file) {
            return;
        }

        try {
            const result = await FilesService.convertToPdf(file.id);
            if (result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Convert to PDF error:', error);
        }
    }, [file]);

    const handleAdd = useCallback(() => {
        if (!file) return;
        // TODO: Implement add functionality
        console.log('Add to file:', file.id);
    }, [file]);

    const handleEdit = useCallback(() => {
        if (!file) return;
        // TODO: Implement edit functionality
        console.log('Edit file:', file.id);
    }, [file]);

    const handleMore = useCallback(() => {
        if (!file) return;
        console.log('More actions for file:', file.id);
        // TODO: Implement more actions menu
    }, [file]);

    const buttons = useMemo(() => [
        {
            icon: (
                <IconButton
                    aria-label="To Scan"
                    disabled={!hasFile}
                    className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
                >
                    <DocumentScannerIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'To Scan',
            onClick: handleToScan,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="To PDF"
                    disabled={!hasFile}
                    className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
                >
                    <PictureAsPdfIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'To PDF',
            onClick: handleToPdf,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Add"
                    disabled={!hasFile}
                    className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
                >
                    <AddAPhotoIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Thêm',
            onClick: handleAdd,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Edit"
                    disabled={!hasFile}
                    className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
                >
                    <EditIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Sửa',
            onClick: handleEdit,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="More"
                    disabled={!hasFile}
                    className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
                >
                    <MoreVertIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Khác',
            onClick: handleMore,
            visible: true,
        },
    ], [hasFile, handleToScan, handleToPdf, handleAdd, handleEdit, handleMore]);

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
        </Box>
    );
}

export default memo(FileDetailFooterComponent);

