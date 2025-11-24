/**
 * Builds a URL query string from an object of parameters
 * @param params - Object containing query parameters
 * @returns URL-encoded query string (without leading '?')
 */
export function buildParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // Skip null, undefined, and empty string values
        if (value === null || value === undefined || value === '') {
            return;
        }

        // Convert value to string and add to search params
        // URLSearchParams automatically handles encoding
        searchParams.append(key, String(value));
    });

    return searchParams.toString();
}