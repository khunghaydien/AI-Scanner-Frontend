'use client';

import { useEffect, useMemo, useState } from 'react';
import { convertDocOrTxtToHtml, getFileTypeFlags } from '../utils';

export const useFilePreview = (open: boolean, file: File | null, previewUrl: string | null) => {
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const flags = useMemo(
    () =>
      file ? getFileTypeFlags(file) : { isImage: false, isPdf: false, isWord: false, isTxt: false },
    [file]
  );

  useEffect(() => {
    const process = async () => {
      if (open && file && (flags.isWord || flags.isTxt)) {
        try {
          setLoading(true);
          setDocxHtml(null);
          const html = await convertDocOrTxtToHtml(file);
          setDocxHtml(html);
        } catch (err) {
          console.error('Error preparing preview:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setDocxHtml(null);
      }
    };
    process();
  }, [open, file, flags.isWord, flags.isTxt]);

  const previewKey = useMemo(() => {
    if (loading) return 'loading';
    if (flags.isImage && previewUrl) return 'image';
    if (flags.isPdf && previewUrl) return 'pdf';
    if ((flags.isWord || flags.isTxt) && docxHtml) return 'document';
    return 'unsupported';
  }, [loading, flags.isImage, flags.isPdf, flags.isWord, flags.isTxt, previewUrl, docxHtml]);

  const handleDownload = () => {
    if (previewUrl && file) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return { docxHtml, previewKey, handleDownload } as const;
};
