'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import clsx from 'clsx';
import IconMoon from '../../icons/icon-moon';
import IconSun from '../../icons/icon-sun';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [mounted, setMounted] = React.useState(false);
  const isDark = muiTheme.palette.mode === 'dark';

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton size="small" className="w-8 h-8">
        <IconMoon className={clsx("h-6 w-6", isDark ? 'text-muted-foreground' : 'text-foreground')} />
      </IconButton>
    );
  }

  return (
    <Tooltip title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton 
        aria-label="Theme Toggle" 
        size="small"
        className="w-8 h-8"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? (
          <IconMoon className={clsx("h-6 w-6", isDark ? 'text-muted-foreground' : 'text-foreground')} />
        ) : (
          <IconSun className={clsx("h-6 w-6", isDark ? 'text-muted-foreground' : 'text-foreground')} />
        )}
      </IconButton>
    </Tooltip>
  );
}
