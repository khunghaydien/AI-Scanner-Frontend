import { fetchClient } from ".";
import { ENDPOINT } from "./endpoint";
import { buildParams } from "./services.ultils";

interface GetFilesParams {
    cursor?: string;
    limit?: number;
}


export interface FileResponse {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl?: string;
    previewUrl?: string;
}

export interface UpdateFileDto {
    fileName?: string;
    [key: string]: any;
}

export interface DeleteFilesDto {
    fileIds: string[];
}

interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
}

export class FilesService {
    /**
     * Upload files
     * @param files - The files to upload
     */
    static async uploadFiles(files: File[]) {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetchClient<ApiResponse<FileResponse[]>>(ENDPOINT.FILES_SERVICE, {
                method: 'POST',
                body: formData,
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload file');
        }
    }

    /**
     * Get user files with pagination
     * @param params - Query parameters (cursor, limit)
     */
    static async getFiles(params: GetFilesParams) {
        try {
            const queryParams = buildParams(params);
            const url = queryParams
                ? `${ENDPOINT.FILES_SERVICE}?${queryParams}`
                : ENDPOINT.FILES_SERVICE;

            const response = await fetchClient<ApiResponse<{
                files: FileResponse[];
                hasMore: boolean;
                nextCursor: string | null;
            }>>(url, {
                method: 'GET',
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get files');
        }
    }

    /**
     * Get total files count
     */
    static async getTotalFilesCount() {
        try {
            const response = await fetchClient<ApiResponse<number>>(
                `${ENDPOINT.FILES_SERVICE}/total`,
                {
                    method: 'GET',
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get total files count');
        }
    }

    /**
     * Get file by ID
     * @param fileId - The file ID
     */
    static async getFileById(fileId: string) {
        try {
            const response = await fetchClient<ApiResponse<FileResponse>>(
                `${ENDPOINT.FILES_SERVICE}/${fileId}`,
                {
                    method: 'GET',
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get file');
        }
    }

    /**
     * Update file
     * @param fileId - The file ID
     * @param updateDto - Update data
     */
    static async updateFile(fileId: string, updateDto: UpdateFileDto) {
        try {
            const response = await fetchClient<ApiResponse<FileResponse>>(
                `${ENDPOINT.FILES_SERVICE}/${fileId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(updateDto),
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update file');
        }
    }

    /**
     * Delete files
     * @param fileIds - Array of file IDs to delete
     */
    static async deleteFiles(fileIds: string[]) {
        try {
            const response = await fetchClient<ApiResponse<{}>>(
                ENDPOINT.FILES_SERVICE,
                {
                    method: 'DELETE',
                    body: JSON.stringify({ fileIds } as DeleteFilesDto),
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete files');
        }
    }
}