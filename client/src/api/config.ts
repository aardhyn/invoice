import { QueryClient } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

export function endpoint(...path: string[]) {
  return `${API_DOMAIN}/${path.join("/")}`;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: STALE_TIME },
  },
});
