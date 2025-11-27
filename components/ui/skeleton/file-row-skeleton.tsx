import { Box } from '@mui/material';
import clsx from 'clsx';

export const FileRowSkeleton = () => {
    return (
        <Box className="group items-center flex gap-2 mb-3">
            {/* Thumbnail skeleton - 70x70px */}
            <div className="w-[70px] h-[70px] rounded-lg bg-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            {/* Content skeleton */}
            <div className="items-center flex gap-4 flex-1 min-w-0 h-[70px] pl-2 bg-muted/50 rounded-lg border border-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <Box className="flex-1 min-w-0 space-y-2 relative z-10">
                    {/* File name skeleton */}
                    <div className="h-5 w-3/4 rounded bg-muted/70" />
                    {/* Date skeleton */}
                    <div className="h-4 w-1/2 rounded bg-muted/70" />
                </Box>
                {/* Checkbox skeleton */}
                <div className="w-6 h-6 rounded bg-muted/70 relative z-10" />
            </div>
        </Box>
    );
};

