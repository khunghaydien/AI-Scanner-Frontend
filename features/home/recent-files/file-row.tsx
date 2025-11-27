import { memo, useMemo, useState } from 'react';
import { Box, Typography, Checkbox } from "@mui/material";
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import { formatDateTime } from "./utils";
import { FileResponse } from "@/services/files.service";
import { useRouter } from 'next/navigation';

interface FileRowProps {
    file: FileResponse;
    isChecked: boolean;
    onToggleCheck: () => void;
}

function FileRowComponent({ file, isChecked, onToggleCheck }: FileRowProps) {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();
    // Use thumbnailUrl first, then first fileUrl from fileUrls array
    const imageUrl = useMemo(
        () => file.thumbnailUrl || file.fileUrls?.[0] || '',
        [file.thumbnailUrl, file.fileUrls]
    );

    const formattedDate = useMemo(
        () => formatDateTime(file.updatedAt),
        [file.updatedAt]
    );

    const handleImageError = () => setImageError(true);

    return (
        <Box className="group items-center flex gap-2 mb-3" onClick={() => router.push(`/document/${file.id}`)}>
            {!imageError && imageUrl ? (
                <div className="w-[70px] h-[70px] rounded-lg overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={file.fileName}
                        width={70}
                        height={70}
                        className="w-[70px] h-[70px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                        unoptimized
                        onError={handleImageError}
                    />
                </div>
            ) : (
                <div className="w-[70px] h-[70px] rounded-lg bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
            )}
            <div className="items-center flex gap-4 flex-1 min-w-0 h-[70px] pl-2 bg-muted/50 rounded-lg border border-muted/50">
                <Box className="flex-1 min-w-0">
                    <Typography variant="body1" className="font-medium truncate">
                        {file.fileName}
                    </Typography>
                    <Typography variant="caption" className="text-muted-foreground">
                        {formattedDate}
                    </Typography>
                </Box>
                <div className="flex items-center justify-center">
                    <Checkbox
                        className="h-fit"
                        checked={isChecked}
                        onChange={onToggleCheck}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        </Box>
    );
}

export default memo(FileRowComponent, (prevProps, nextProps) => {
    return (
        prevProps.file.id === nextProps.file.id &&
        prevProps.file.fileName === nextProps.file.fileName &&
        prevProps.file.updatedAt === nextProps.file.updatedAt &&
        prevProps.file.thumbnailUrl === nextProps.file.thumbnailUrl &&
        JSON.stringify(prevProps.file.fileUrls) === JSON.stringify(nextProps.file.fileUrls) &&
        prevProps.isChecked === nextProps.isChecked &&
        prevProps.onToggleCheck === nextProps.onToggleCheck
    );
});
