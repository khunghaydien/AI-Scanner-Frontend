'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslations } from 'next-intl';
import { useFilePreview } from './use-file-preview.hook';
import { getFileTypeLabel, formatFileSize } from '../utils';
interface FilePreviewProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  previewUrl: string | null;
}

export const FilePreview: React.FC<FilePreviewProps> = React.memo(
  ({ open, onClose, file, previewUrl }) => {
    if (!file) return null;

    const t = useTranslations();
    const { docxHtml, previewKey, handleDownload } = useFilePreview(open, file, previewUrl);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: 'max-h-[90vh]',
        }}
      >
        <DialogTitle>
          <Box className="flex items-center justify-between">
            <Typography
              variant="h6"
              component="div"
              className="overflow-hidden text-ellipsis whitespace-nowrap pr-4"
            >
              {file.name}
            </Typography>
            <Box className="flex gap-2">
              <IconButton onClick={handleDownload} size="small" color="primary">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="flex justify-center items-center min-h-[400px]">
            {previewKey === 'loading' && (
              <Box className="text-center p-8">
                <Typography variant="body1">{t('file_preview_loading')}</Typography>
              </Box>
            )}
            {previewKey === 'image' && (
              <img
                src={previewUrl!}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
            {previewKey === 'pdf' && (
              <iframe src={previewUrl!} className="w-full h-[70vh] border-0" />
            )}
            {previewKey === 'document' && (
              <>
                <style>{`
                                .word-preview * { color: inherit !important; }
                                .word-preview p, .word-preview span, .word-preview div, .word-preview td, .word-preview th { color: inherit !important; }
                            `}</style>
                <Box
                  className="word-preview w-full max-h-[70vh] overflow-auto p-6 border border-border rounded bg-background text-foreground"
                  dangerouslySetInnerHTML={{ __html: docxHtml! }}
                />
              </>
            )}
            {previewKey === 'unsupported' && (
              <Box className="text-center p-8">
                <InsertDriveFileIcon className="text-[64px] text-muted-foreground mb-4" />
                <Typography variant="h6" gutterBottom>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  {getFileTypeLabel(file)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('file_preview_size')}: {formatFileSize(file.size)}
                </Typography>
                <Typography variant="body2" className="mt-4 text-muted-foreground">
                  {t('file_preview_unsupported')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
);
