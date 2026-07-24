export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
