'use client';

import { memo, useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommonButton } from "@/components/ui/button";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FileResponse, FilesService } from "@/services/files.service";
import { useRouter } from "next/navigation";

interface FileActionsProps {
    checkedFiles: FileResponse[];
}

function FileActionsComponent({
    checkedFiles,
}: FileActionsProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const hasSelection = checkedFiles.length > 0;
    const isSingleSelection = checkedFiles.length === 1;
    const isMultipleSelection = checkedFiles.length > 1;

    const deleteMutation = useMutation({
        mutationFn: async (fileIds: string[]) => {
            return await FilesService.deleteFiles(fileIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files', 'recent'] });
        },
    });

    const handleToScan = useCallback(async () => {
        if (checkedFiles.length === 0 || checkedFiles.length > 1) {
            return;
        }

        try {
            const file = checkedFiles[0];
            const result = await FilesService.convertToScan(file.id);
            if (result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Convert to scan error:', error);
        }
    }, [checkedFiles]);

    const handleToPdf = useCallback(async () => {
        if (checkedFiles.length === 0 || checkedFiles.length > 1) {
            return;
        }

        try {
            const file = checkedFiles[0];
            const result = await FilesService.convertToPdf(file.id);
            if (result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Convert to PDF error:', error);
        }
    }, [checkedFiles]);

    const handleDelete = useCallback(async () => {
        if (checkedFiles.length === 0) return;

        const fileCount = checkedFiles.length;
        const confirmMessage = fileCount === 1
            ? `Bạn có chắc chắn muốn xóa file "${checkedFiles[0].fileName}"?`
            : `Bạn có chắc chắn muốn xóa ${fileCount} files?`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const fileIds = checkedFiles.map((file) => file.id);
            await deleteMutation.mutateAsync(fileIds);
        } catch (error: any) {
            console.error('Delete error:', error);
        }
    }, [checkedFiles, deleteMutation]);

    const handleEdit = useCallback(() => {
        const selectedFile = checkedFiles[0];
        router.push(`/document/${selectedFile.id}`);
    }, [checkedFiles]);

    const mergeMutation = useMutation({
        mutationFn: async (fileIds: string[]) => {
            return await FilesService.mergeFiles(fileIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files', 'recent'] });
        },
    });

    const handleMerge = useCallback(async () => {
        if (checkedFiles.length < 2) {
            return;
        }

        const fileCount = checkedFiles.length;
        const confirmMessage = `Bạn có chắc chắn muốn merge ${fileCount} files thành một file?`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const fileIds = checkedFiles.map((file) => file.id);
            await mergeMutation.mutateAsync(fileIds);
            alert(`Đã merge thành công ${fileCount} file(s) thành một file`);
        } catch (error: any) {
            console.error('Merge error:', error);
            alert(error?.message || 'Merge files thất bại. Vui lòng thử lại.');
        }
    }, [checkedFiles, mergeMutation]);

    const handleMore = useCallback(() => {
        console.log('More actions for files:', checkedFiles);
        // TODO: Implement more actions menu
    }, [checkedFiles]);

    const buttons = useMemo(() => [
        {
            icon: (
                <IconButton
                    aria-label="To Scan"
                    disabled={!isSingleSelection}
                    className={clsx(!isSingleSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <DocumentScannerIcon className={clsx("h-6 w-6", isSingleSelection ? 'text-foreground' : 'text-muted-foreground')} />
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
                    disabled={!isSingleSelection}
                    className={clsx(!isSingleSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <PictureAsPdfIcon className={clsx("h-6 w-6", isSingleSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'To PDF',
            onClick: handleToPdf,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Delete"
                    disabled={!hasSelection || deleteMutation.isPending}
                    className={clsx((!hasSelection || deleteMutation.isPending) && 'opacity-50 cursor-not-allowed')}
                >
                    <DeleteIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Delete',
            onClick: handleDelete,
            visible: true,
        },
        {
            icon: (
                <IconButton aria-label="Edit">
                    <EditIcon className="h-6 w-6 text-foreground" />
                </IconButton>
            ),
            label: 'Edit',
            onClick: handleEdit,
            visible: isSingleSelection,
        },
        {
            icon: (
                <IconButton
                    aria-label="Merge"
                    disabled={!isMultipleSelection || mergeMutation.isPending}
                    className={clsx((!isMultipleSelection || mergeMutation.isPending) && 'opacity-50 cursor-not-allowed')}
                >
                    <MergeTypeIcon className="h-6 w-6 text-foreground" />
                </IconButton>
            ),
            label: 'Merge',
            onClick: handleMerge,
            visible: isMultipleSelection,
        },
        {
            icon: (
                <IconButton
                    aria-label="More"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <MoreVertIcon className="h-6 w-6 text-foreground" />
                </IconButton>
            ),
            label: 'More',
            onClick: handleMore,
            visible: true,
        },
    ], [hasSelection, isSingleSelection, isMultipleSelection, deleteMutation.isPending, mergeMutation.isPending, handleToScan, handleToPdf, handleDelete, handleEdit, handleMerge, handleMore]);

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

export const FileActions = memo(FileActionsComponent);
