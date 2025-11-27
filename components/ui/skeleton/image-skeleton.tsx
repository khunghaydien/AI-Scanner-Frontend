import { Box } from '@mui/material';
import clsx from 'clsx';

interface ImageSkeletonProps {
    className?: string;
}

export const ImageSkeleton = ({ className }: ImageSkeletonProps) => {
    return (
        <div
            className={clsx(
                'relative w-full flex justify-center min-h-[50vh]',
                className
            )}
        >
            <div className="w-full max-w-4xl h-full min-h-[50vh] rounded-lg bg-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
};

