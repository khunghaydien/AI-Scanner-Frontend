import { fetchClient } from ".";
import { ENDPOINT } from "./endpoint";
import { buildParams } from "./services.ultils";

interface GetFilesParams {
    cursor?: string;
    limit?: number;
}

export class FilesService {
    /**
     * Upload a file
     * @param files - The files to upload
     */
    static async uploadFiles(files: File[]) {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetchClient<{ data: any }>(ENDPOINT.FILES_SERVICE, {
                method: 'POST',
                body: formData,
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload file');
        }
    }
    static async getFiles(getFilesParams: GetFilesParams) {
        try {
            const params = buildParams(getFilesParams);
            const url = params 
                ? `${ENDPOINT.FILES_SERVICE}?${params}`
                : ENDPOINT.FILES_SERVICE;

            const response = await fetchClient<{
                success: boolean;
                status: number;
                message: string;
                data: {
                    files: any[];
                    hasMore: boolean;
                    nextCursor: string | null;
                };
            }>(url, {
                method: 'GET',
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get files');
        }
    }
}