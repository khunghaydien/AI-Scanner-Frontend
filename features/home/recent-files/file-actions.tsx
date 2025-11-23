'use client';

import { CommonButton } from "@/components/ui/button";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FileItem } from "./recent-files.hook";
import { useCallback } from "react";

interface FileActionsProps {
    checkedFiles: FileItem[];
}

export function FileActions({
    checkedFiles,
}: FileActionsProps) {
    const hasSelection = checkedFiles.length > 0;
    const isSingleSelection = checkedFiles.length === 1;
    const isMultipleSelection = checkedFiles.length > 1;

    // Action handlers
    const handleShare = useCallback(() => {
        console.log('Share files:', Array.from(checkedFiles));
        // TODO: Implement share functionality
    }, [checkedFiles]);

    const handleCopy = useCallback(() => {
        console.log('Copy files:', Array.from(checkedFiles));
        // TODO: Implement copy functionality
    }, [checkedFiles]);

    const handleDelete = useCallback(() => {
        console.log('Delete files:', Array.from(checkedFiles));
        // TODO: Implement delete functionality
    }, [checkedFiles]);

    const handleEdit = useCallback(() => {
        const selectedFileId = Array.from(checkedFiles)[0];
        console.log('Edit file:', selectedFileId);
        // TODO: Implement edit functionality
    }, [checkedFiles]);

    const handleMerge = useCallback(() => {
        console.log('Merge files:', Array.from(checkedFiles));
        // TODO: Implement merge functionality
    }, [checkedFiles]);

    const handleMore = useCallback(() => {
        console.log('More actions for files:', Array.from(checkedFiles));
        // TODO: Implement more actions menu
    }, [checkedFiles]);


    const buttons = [
        {
            icon: (
                <IconButton
                    aria-label="Chia sẻ"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <ShareIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Chia sẻ',
            onClick: handleShare
        },
        {
            icon: (
                <IconButton
                    aria-label="Sao chép"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <ContentCopyIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Sao chép',
            onClick: handleCopy,
        },
        {
            icon: (
                <IconButton
                    aria-label="Xóa"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <DeleteIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Xóa',
            onClick: handleDelete,
        },
        {
            icon: (
                <IconButton aria-label="Chỉnh sửa">
                    <EditIcon className="h-6 w-6 text-foreground" />
                </IconButton>
            ),
            label: 'Chỉnh sửa',
            onClick: handleEdit,
            visible: isSingleSelection,
        },
        {
            icon: (
                <IconButton aria-label="Merge">
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
                    aria-label="Khác"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <MoreVertIcon className="h-6 w-6 text-foreground" />
                </IconButton>
            ),
            label: 'Khác',
            onClick: handleMore,
        },
    ];

    return (
        <Box
            component="footer"
            className="h-16 fixed bottom-0 left-0 right-0 z-[60] border-t border-border bg-background flex items-center justify-center"
        >
            {buttons
                .filter(button => button.visible !== false)
                .map((button, index) => (
                    <CommonButton
                        key={index}
                        icon={button.icon}
                        onClick={button.onClick}
                        className="flex-1"
                    />
                ))}
        </Box>
    );
}
