'use client';

import React from 'react';
import { Paper } from '@mui/material';
import { cva } from 'class-variance-authority';

interface DragDropZoneProps {
  disabled?: boolean;
  isDragging?: boolean;
  error?: string;
  onClick?: () => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

const zoneClass = cva('p-8 mt-2 text-center transition-all duration-300 ease-in-out border-2', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-60 bg-background border-solid border-gray-300',
      false: '',
    },
    error: {
      true: 'cursor-pointer hover:border-red-600 bg-background border-solid border-red-500',
      false: '',
    },
    dragging: {
      true: 'cursor-pointer bg-primary/10 border-dashed border-primary shadow-[0_8px_16px_rgba(25,118,210,0.3)]',
      false: 'cursor-pointer hover:border-primary bg-background border-solid border-gray-300',
    },
  },
  compoundVariants: [{ error: true, dragging: true, class: 'border-red-500' }],
});

export function DragDropZone({
  disabled = false,
  isDragging = false,
  error,
  onClick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: DragDropZoneProps) {
  return (
    <Paper
      variant="outlined"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={zoneClass({ disabled, error: !!error, dragging: !!isDragging })}
    >
      {children}
    </Paper>
  );
}
