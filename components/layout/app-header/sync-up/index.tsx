'use client';
import { IconSync } from "@/components/icons";
import { IconButton, Tooltip } from "@mui/material";
export const SyncUp = () => {
    return (
        <Tooltip title="Sync">
            <IconButton
                aria-label="Sync"
            >
                <IconSync className="h-6 w-6" style={{ color: 'lightblue' }} />
            </IconButton>
        </Tooltip>
    );
};