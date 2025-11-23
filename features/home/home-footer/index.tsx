'use client';

import { IconButton } from "@mui/material";
import { IconHome, IconDocument, IconTool, IconUser } from '@/components/icons';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import AppFooter from '@/components/app-footer';
import { useTheme } from '@mui/material/styles';

export function HomeFooter() {
    const pathname = usePathname();
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isHomeActive = pathname === '/' || pathname === '/home';
    const isDocumentActive = pathname.startsWith('/document');
    const isToolActive = pathname.startsWith('/tool');
    const isMeActive = pathname.startsWith('/me');

    const buttons = [
        {
            icon: (
                <IconButton aria-label="Home">
                    <IconHome className={clsx("h-6 w-6", isHomeActive ? 'text-primary' : isDark ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            onClick: () => router.push('/'),
            label: 'Home',
            active: isHomeActive,
        },
        {
            icon: (
                <IconButton aria-label="Document">
                    <IconDocument className={clsx("h-6 w-6", isDocumentActive ? 'text-primary' : isDark ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            onClick: () => router.push('/document'),
            label: 'Document',
            active: isDocumentActive,
        },
        {
            icon: (
                <IconButton aria-label="Tool">
                    <IconTool className={clsx("h-6 w-6", isToolActive ? 'text-primary' : isDark ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            onClick: () => router.push('/tool'),
            label: 'Tool',
            active: isToolActive,
        },
        {
            icon: (
                <IconButton aria-label="Me">
                    <IconUser className={clsx("h-6 w-6", isMeActive ? 'text-primary' : isDark ? 'text-muted-foreground' : 'text-foreground')} />
                </IconButton>
            ),
            onClick: () => router.push('/me'),
            label: 'Me',
            active: isMeActive,
        },
    ];

    return (
        <AppFooter
            buttons={buttons.map(button => ({
                icon: button.icon,
                onClick: button.onClick,
                label: button.label,
                className: 'flex-1',
                active: button.active,
            }))}
        />
    );
}
