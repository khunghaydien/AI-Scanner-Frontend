export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileTypeLabel = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    docx: 'Microsoft Word Document',
    doc: 'Microsoft Word Document',
    xlsx: 'Microsoft Excel Spreadsheet',
    xls: 'Microsoft Excel Spreadsheet',
    pptx: 'Microsoft PowerPoint Presentation',
    ppt: 'Microsoft PowerPoint Presentation',
    pdf: 'PDF Document',
    txt: 'Text Document',
    csv: 'CSV File',
  };
  return typeMap[extension] || file.type || 'Unknown File Type';
};

export const isValidFileType = (accept: string | undefined, file: File): boolean => {
  if (!accept) return true;
  const acceptPatterns = accept.split(',').map((pattern) => pattern.trim());

  for (const pattern of acceptPatterns) {
    if (pattern === 'image/*') {
      if (file.type.startsWith('image/')) return true;
    } else if (pattern.startsWith('.')) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (extension === pattern.toLowerCase()) return true;
    } else {
      if (file.type === pattern) return true;
    }
  }

  return false;
};

export const getFileTypeFlags = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return {
    isImage: file.type.startsWith('image/'),
    isPdf: file.type === 'application/pdf' || extension === 'pdf',
    isWord:
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword',
    isTxt: file.type === 'text/plain' || extension === 'txt',
  };
};

export const convertDocOrTxtToHtml = async (file: File): Promise<string | null> => {
  const isWord =
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword';
  const isTxt = file.type === 'text/plain';

  if (!isWord && !isTxt) return null;

  // Lazy import to avoid bundling mammoth in unrelated paths
  const { default: mammoth } = await import('mammoth');

  if (isWord) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  }

  const text = await file.text();
  return text
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');
};

export const createObjectUrls = (files: File[]): string[] =>
  files.map((file) => URL.createObjectURL(file));

export const revokeObjectUrls = (urls: string[]): void => {
  urls.forEach((url) => URL.revokeObjectURL(url));
};
