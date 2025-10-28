'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  convertDocOrTxtToHtml,
  createObjectUrls,
  getFileTypeFlags,
  isValidFileType,
  revokeObjectUrls,
} from '../utils';

export interface UseFileInputParams {
  disabled?: boolean;
  accept?: string;
  value?: FileList | File[] | null;
  onChange?: (files: FileList | null) => void;
}

export const useFileInput = ({ disabled, accept, value, onChange }: UseFileInputParams) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [docHtmls, setDocHtmls] = useState<{ [key: number]: string }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value to internal state
  useEffect(() => {
    if (value) {
      const fileArray = value instanceof FileList ? Array.from(value) : value;
      setFiles(fileArray);
    } else {
      setFiles([]);
    }
  }, [value]);

  const isValid = useCallback((file: File) => isValidFileType(accept, file), [accept]);

  const createFileList = useCallback((fileArray: File[]): FileList | null => {
    try {
      const dt = new DataTransfer();
      fileArray.forEach((file) => dt.items.add(file));
      if (inputRef.current) {
        inputRef.current.files = dt.files;
      }
      return dt.files && dt.files.length > 0 ? dt.files : null;
    } catch (err) {
      console.error('Error creating FileList:', err);
      return null;
    }
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!disabled && e.dataTransfer?.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter((file) => isValid(file));
        const newFiles = [...files, ...validFiles];
        setFiles(newFiles);
        if (onChange) {
          onChange(createFileList(newFiles));
        }
      }
    },
    [disabled, files, isValid, onChange, createFileList]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const selectedFiles = e?.target?.files;
        if (selectedFiles && selectedFiles.length > 0) {
          const validFiles = Array.from(selectedFiles).filter((file) => isValid(file));
          const newFiles = [...files, ...validFiles];
          setFiles(newFiles);
          if (onChange) {
            onChange(createFileList(newFiles));
          }
        }
      } catch (err) {
        console.error('Error in handleFileChange:', err);
      }
    },
    [files, isValid, onChange, createFileList]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (onChange) {
        onChange(createFileList(newFiles));
      }
    },
    [files, onChange, createFileList]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  // Previews and doc conversion
  useEffect(() => {
    const urls = createObjectUrls(files);
    setPreviewUrls(urls);

    const convertDocsToHtml = async () => {
      const htmlMap: { [key: number]: string } = {};
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const html = await convertDocOrTxtToHtml(file);
          if (html) htmlMap[i] = html;
        } catch (err) {
          console.error('Error converting file to HTML for preview:', err);
        }
      }
      setDocHtmls(htmlMap);
    };

    convertDocsToHtml();

    return () => {
      revokeObjectUrls(urls);
    };
  }, [files]);

  const handleOpenPreview = useCallback(
    (index: number) => {
      if (index >= 0 && index < files.length) {
        setPreviewFile(files[index]);
        setPreviewModalOpen(true);
      }
    },
    [files]
  );

  const handleClosePreview = useCallback(() => {
    setPreviewModalOpen(false);
    setPreviewFile(null);
  }, []);

  const computeFlags = useCallback((file: File) => getFileTypeFlags(file), []);

  return {
    // state
    files,
    isDragging,
    previewModalOpen,
    previewFile,
    previewUrls,
    docHtmls,
    inputRef,
    // handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    handleRemoveFile,
    handleClick,
    handleOpenPreview,
    handleClosePreview,
    // helpers
    computeFlags,
  } as const;
};
