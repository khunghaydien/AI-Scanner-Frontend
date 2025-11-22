'use client';

import { Box, IconButton } from '@mui/material';
import { IconHome, IconDocument, IconTool, IconUser } from '@/components/icons';
import { ButtonProps, CommonButton } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import clsx from 'clsx';
import UploadFile from '../upload-file';
interface FooterButtonConfig {
  path: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  activePaths?: string[];
}

// Button configurations - moved outside component to prevent recreation
const FOOTER_BUTTON_CONFIGS: Omit<FooterButtonConfig, 'icon'>[] = [
  {
    path: '/',
    label: 'Home',
    ariaLabel: 'Home',
    activePaths: ['/', '/home'],
  },
  {
    path: '/document',
    label: 'Document',
    ariaLabel: 'Document',
  },
  {
    path: '/tool',
    label: 'Tool',
    ariaLabel: 'Tool',
  },
  {
    path: '/me',
    label: 'Me',
    ariaLabel: 'Me',
  },
];

// Icon components mapping
const ICON_COMPONENTS = {
  Home: IconHome,
  Document: IconDocument,
  Tool: IconTool,
  Me: IconUser,
} as const;

export default function AppFooter({ buttons }: { buttons: ButtonProps[] }) {
  return (
    <>
      <Box
        component="footer"
        className="h-16 fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex items-center justify-center"
      >
        {buttons.map((button) => (
          <CommonButton
            key={button.label}
            icon={button.icon}
            label={button.label}
            onClick={button.onClick}
            className={button.className}
            active={button.active}
          />
        ))}
      </Box>
      <UploadFile />
    </>
  );
}

export const HomeFooter = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Check if path is active
  const isActive = (config: Omit<FooterButtonConfig, 'icon'>): boolean => {
    if (config.activePaths) {
      return config.activePaths.includes(pathname);
    }
    return pathname.startsWith(config.path);
  };

  // Memoize buttons to prevent unnecessary re-renders
  const homeFooterButtons: ButtonProps[] = useMemo(
    () =>
      FOOTER_BUTTON_CONFIGS.map((config) => {
        const IconComponent = ICON_COMPONENTS[config.label as keyof typeof ICON_COMPONENTS];

        return {
          icon: (
            <IconButton aria-label={config.ariaLabel}>
              <IconComponent className={clsx("h-6 w-6", isActive(config) ? 'text-primary' : 'text-foreground')} />
            </IconButton>
          ),
          label: config.label,
          active: isActive(config),
          onClick: () => router.push(config.path),
          className: 'flex-1',
        };
      }),
    [pathname, router]
  );

  return <AppFooter buttons={homeFooterButtons} />;
};

export { AppFooter };