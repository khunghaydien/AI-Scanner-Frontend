import { memo, useMemo, useState } from 'react';
import { FileItem } from "./recent-files.hook";
import { Box, Typography, Checkbox } from "@mui/material";
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import { formatDateTime } from "./utils";

interface FileRowProps {
    file: FileItem;
    isChecked: boolean;
    onToggleCheck: () => void;
}

function FileRowComponent({ file, isChecked, onToggleCheck }: FileRowProps) {
    const [imageError, setImageError] = useState(false);

    const imageUrl = useMemo(
        () => file.thumbnailUrl || file.previewUrl || file.fileUrl,
        [file.thumbnailUrl, file.previewUrl, file.fileUrl]
    );
    const isImage = useMemo(
        () => file.mimeType.startsWith('image/'),
        [file.mimeType]
    );
    const formattedDate = useMemo(
        () => formatDateTime(file.updatedAt),
        [file.updatedAt]
    );

    const handleImageError = () => setImageError(true);

    return (
        <Box className="group items-center flex gap-2 mb-3">
            {isImage && !imageError ? (
                <Image
                    src={imageUrl}
                    alt={file.fileName}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-lg"
                    unoptimized
                    onError={handleImageError}
                />
            ) : (
                <div className="w-[70px] h-[70px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-lg bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
            )}
            <div className="items-center flex gap-4 flex-1 min-w-0 h-[70px] pl-2 bg-muted/50 rounded-lg">
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
        prevProps.file.previewUrl === nextProps.file.previewUrl &&
        prevProps.file.fileUrl === nextProps.file.fileUrl &&
        prevProps.file.mimeType === nextProps.file.mimeType &&
        prevProps.isChecked === nextProps.isChecked &&
        prevProps.onToggleCheck === nextProps.onToggleCheck
    );
});
  