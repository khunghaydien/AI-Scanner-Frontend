import { Typography } from '@mui/material';
import React from 'react';
import clsx from 'clsx';
export type ButtonProps = {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
};

export const CommonButton = ({ icon, label, onClick, className, active = false }: ButtonProps) => {
  const textColorClass = active ? 'text-primary' : 'text-foreground';
  
  return (
    <div
      className={clsx('flex flex-col items-center justify-center flex-1 cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={textColorClass}>
        {icon && icon}
      </div>
      {label && (
        <Typography variant="body2" className={clsx('text-sm', textColorClass)}>
          {label}
        </Typography>
      )}
    </div>
  );
};
