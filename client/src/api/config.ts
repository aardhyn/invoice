import { QueryClient } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

const API_ROOT = import.meta.env.VITE_API_URL;

export function endpoint(...path: string[]) {
  return `${API_ROOT}/${path.join("/")}`;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: STALE_TIME },
  },
});
