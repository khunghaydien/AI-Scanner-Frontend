import { fetchClient } from '.';

// Types for media service
export interface UploadFileData {
  description?: string;
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

