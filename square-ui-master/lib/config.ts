export const API_BASE_URL = "http://localhost:8000";

export const getApiUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/api/${cleanPath}`;
};
