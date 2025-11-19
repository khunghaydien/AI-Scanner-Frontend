'use client';

import { Box, IconButton } from '@mui/material';
import { IconHome, IconDocument, IconTool, IconUser } from '@/components/icons';
import { ButtonProps, CommonButton } from '@/components/ui/button';
export default function AppFooter({ buttons }: { buttons: ButtonProps[] }) {
  return (
    <Box
      component="footer"
      className="h-16 fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex items-center justify-between"
    >
      {buttons.map((button, index) => {
        return (
          <CommonButton
            key={index}
            icon={button.icon}
            label={button.label}
            onClick={button.onClick}
            className={button.className}
          />
        );
      })}
    </Box>
  );
}
const homeFooterButtons: ButtonProps[] = [
  {
    icon:
      <IconButton aria-label="Home">
        <IconHome className="h-6 w-6"
          style={{
            color: '#3B82F6'
          }}
        />
      </IconButton>,
    label: 'Home',
    onClick: () => { },
    className: 'flex-1'
  },
  {
    icon: <IconButton aria-label="Document">
      <IconDocument className="h-6 w-6"
        style={{
          color: '#10B981'
        }} />
    </IconButton>, label: 'Document',
    onClick: () => { },
    className: 'flex-1'
  },
  {
    icon: <IconButton aria-label="Tool">
      <IconTool className="h-6 w-6"
        style={{
          color: '#F59E0B'
        }} />
    </IconButton>, label: 'Tool',
    onClick: () => { },
    className: 'flex-1'
  },
  {
    icon: <IconButton aria-label="User">
      <IconUser className="h-6 w-6"
        style={{
          color: '#8B5CF6'
        }} />
    </IconButton>,
    label: 'User',
    onClick: () => { },
    className: 'flex-1'
  },
];

export const HomeFooter = () => {
  return <AppFooter buttons={homeFooterButtons} />;
};

export { AppFooter };