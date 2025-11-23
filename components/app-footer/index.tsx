'use client';

import { Box } from '@mui/material';
import { ButtonProps, CommonButton } from '@/components/ui/button';
import UploadFile from '../upload-file';
export interface FooterButtonConfig {
  path: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  activePaths?: string[];
}

export default function AppFooter({ buttons }: { buttons: ButtonProps[] }) {
  return (
    <>
      <Box
        component="footer"
        className="h-16 fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex items-center justify-center"
      >
        {buttons.map((button, index) => (
          <CommonButton
            key={index}
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