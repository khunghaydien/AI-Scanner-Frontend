'use client';

import { memo, useMemo, useCallback } from "react";
import { CommonButton } from "@/components/ui/button";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FileResponse } from "@/services/files.service";

interface FileActionsProps {
    checkedFiles: FileResponse[];
}

function FileActionsComponent({
    checkedFiles,
}: FileActionsProps) {
    const hasSelection = checkedFiles.length > 0;
    const isSingleSelection = checkedFiles.length === 1;
    const isMultipleSelection = checkedFiles.length > 1;

    const handleShare = useCallback(() => {
        console.log('Share files:', checkedFiles);
        // TODO: Implement share functionality
    }, [checkedFiles]);

    const handleCopy = useCallback(() => {
        console.log('Copy files:', checkedFiles);
        // TODO: Implement copy functionality
    }, [checkedFiles]);

    const handleDelete = useCallback(() => {
        console.log('Delete files:', checkedFiles);
        // TODO: Implement delete functionality
    }, [checkedFiles]);

    const handleEdit = useCallback(() => {
        const selectedFile = checkedFiles[0];
        console.log('Edit file:', selectedFile);
        // TODO: Implement edit functionality
    }, [checkedFiles]);

    const handleMerge = useCallback(() => {
        console.log('Merge files:', checkedFiles);
        // TODO: Implement merge functionality
    }, [checkedFiles]);

    const handleMore = useCallback(() => {
        console.log('More actions for files:', checkedFiles);
        // TODO: Implement more actions menu
    }, [checkedFiles]);

    const buttons = useMemo(() => [
        {
            icon: (
                <IconButton
                    aria-label="Share"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <ShareIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Share',
            onClick: handleShare,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Copy"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
                >
                    <ContentCopyIcon className={clsx("h-6 w-6", hasSelection ? 'text-foreground' : 'text-muted-foreground')} />
                </IconButton>
            ),
            label: 'Copy',
            onClick: handleCopy,
            visible: true,
        },
        {
            icon: (
                <IconButton
                    aria-label="Delete"
                    disabled={!hasSelection}
                    className={clsx(!hasSelection && 'opacity-50 cursor-not-allowed')}
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
    ], [hasSelection, isSingleSelection, isMultipleSelection, handleShare, handleCopy, handleDelete, handleEdit, handleMerge, handleMore]);

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
