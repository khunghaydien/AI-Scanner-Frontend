import { fetchClient } from '.';

// Types for media service
export interface UploadFileData {
  description?: string;
}

export interface BatchUploadDto {
  batchId?: string;
  batchIndex?: number;
  totalFiles?: number;
  description?: string;
}

export interface ChunkedBatchResponse {
  isComplete: boolean;
  totalFiles?: number;
  rembgImages?: Media[];
  pdfBwUrl?: string;
  pdfColorUrl?: string;
  failedFiles?: Array<{ fileName: string; error: string }>;
  batchId?: string;
  batchIndex?: number;
  message?: string;
}

export interface UpdateFileData {
  description?: string;
  status?: string;
}

export interface Media {
  id: string;
  user: {
    id: string;
  };
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType?: string;
  description?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

// Media service functions
export class MediaService {
  /**
   * Upload a file
   * @param file - The file to upload
   * @param data - Optional metadata (description)
   */
  static async uploadFile(file: File, data?: UploadFileData) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (data?.description) {
        formData.append('description', data.description);
      }

      const response = await fetchClient<{ data: Media }>('/media', {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  static async uploadFileScanner(file: File, data?: UploadFileData) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (data?.description) {
        formData.append('description', data.description);
      }

      const response = await fetchClient<{ data: Media }>('/media/scanner', {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  static async uploadFileExtractBackground(file: File, data?: UploadFileData) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (data?.description) {
        formData.append('description', data.description);
      }

      const response = await fetchClient<{ data: Media }>('/media/extract-background', {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file');
    }
  }
  static async uploadMagicScannerBatch(files: File[], data?: UploadFileData) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      if (data?.description) {
        formData.append('description', data.description);
      }

      const response = await fetchClient<{ data: Media[] }>('/media/magic-scanner-batch', {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload files');
    }
  }

  static async uploadFileScanerColor(file: File, data?: UploadFileData) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (data?.description) {
        formData.append('description', data.description);
      }

      const response = await fetchClient<{ data: Media }>('/media/scanner-color', {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  /**
   * Upload chunked batch for magic scanner (max 10 files per chunk)
   */
  static async uploadMagicScannerChunked(
    files: File[],
    batchDto?: BatchUploadDto
  ): Promise<ChunkedBatchResponse> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (batchDto?.batchId) {
        formData.append('batchId', batchDto.batchId);
      }
      if (batchDto?.batchIndex !== undefined) {
        formData.append('batchIndex', batchDto.batchIndex.toString());
      }
      if (batchDto?.totalFiles !== undefined) {
        formData.append('totalFiles', batchDto.totalFiles.toString());
      }
      if (batchDto?.description) {
        formData.append('description', batchDto.description);
      }

      const response = await fetchClient<{ data: ChunkedBatchResponse }>(
        '/media/magic-scanner-chunked',
        {
          method: 'POST',
          body: formData,
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload chunked batch');
    }
  }

  /**
   * Cancel batch session
   */
  static async cancelBatchSession(batchId: string): Promise<void> {
    try {
      await fetchClient<{ data: {} }>('/media/magic-scanner-chunked/cancel', {
        method: 'POST',
        body: JSON.stringify({ batchId }),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel batch session');
    }
  }



  /**
   * Get all files for the current user
   */
  static async getUserFiles() {
    try {
      const response = await fetchClient<{ data: Media[] }>('/media', {
        method: 'GET',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch files');
    }
  }

  /**
   * Get a specific file by ID
   * @param fileId - The ID of the file to retrieve
   */
  static async getFileById(fileId: string) {
    try {
      const response = await fetchClient<{ data: Media }>(`/media/${fileId}`, {
        method: 'GET',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch file');
    }
  }

  /**
   * Update a file
   * @param fileId - The ID of the file to update
   * @param data - The data to update (description, status)
   */
  static async updateFile(fileId: string, data: UpdateFileData) {
    try {
      const response = await fetchClient<{ data: Media }>(`/media/${fileId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update file');
    }
  }

  /**
   * Delete a file
   * @param fileId - The ID of the file to delete
   */
  static async deleteFile(fileId: string) {
    try {
      const response = await fetchClient<{ data: {} }>(`/media/${fileId}`, {
        method: 'DELETE',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete file');
    }
  }
}

