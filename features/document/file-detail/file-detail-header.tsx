'use client';

import { FileResponse } from "@/services/files.service";
import { Box, IconButton } from "@mui/material";
import clsx from "clsx";
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";

export default function FileDetailHeader({ file }: { file: FileResponse | undefined }) {
    const router = useRouter();
    const hasFile = !!file;

    const handleEditName = () => {
        // TODO: Implement edit name functionality
        console.log('Edit name:', file?.fileName);
    };

    const handleTag = () => {
        // TODO: Implement tag functionality
        console.log('Tag file:', file?.id);
    };

    const handleMore = () => {
        // TODO: Implement more actions menu
        console.log('More actions for file:', file?.id);
    };

    return (
        <Box
            component="header"
            className="h-16 fixed top-0 left-0 right-0 z-[60] border-b border-border bg-background flex items-center gap-2 "
        >
            <IconButton
                aria-label="Back"
                onClick={() => router.back()}
                className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
            >
                <ArrowBack className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
            </IconButton>
            <p className="font-bold flex-1 truncate">{file?.fileName || 'Loading...'}</p>
            <IconButton
                aria-label="Edit name"
                onClick={handleEditName}
                disabled={!hasFile}
                className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
            >
                <EditIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
            </IconButton>
            <IconButton
                aria-label="Tag"
                onClick={handleTag}
                disabled={!hasFile}
                className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
            >
                <LocalOfferIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
            </IconButton>
            <IconButton
                aria-label="More"
                onClick={handleMore}
                disabled={!hasFile}
                className={clsx(!hasFile && 'opacity-50 cursor-not-allowed')}
            >
                <MoreVertIcon className={clsx("h-6 w-6", hasFile ? 'text-foreground' : 'text-muted-foreground')} />
            </IconButton>
        </Box>
    );
}