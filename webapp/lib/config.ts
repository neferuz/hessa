export const API_BASE_URL = "http://localhost:8000";

export const getApiUrl = (path: string) => {
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
