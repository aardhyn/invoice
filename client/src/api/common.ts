const API_ROOT = import.meta.env.VITE_API_BASE_URL;

export function endpoint(...path: string[]) {
  return `${API_ROOT}/${path.join("/")}`;
}
