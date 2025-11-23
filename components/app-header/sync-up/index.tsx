'use client';
import { IconSync } from '@/components/icons';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import clsx from 'clsx';

export const SyncUp = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title="Sync">
      <IconButton 
        aria-label="Sync"
        size="small"
        className="w-8 h-8"
      >
        <IconSync className={clsx("h-6 w-6", isDark ? 'text-muted-foreground' : 'text-foreground')} />
      </IconButton>
    </Tooltip>
  );
};
