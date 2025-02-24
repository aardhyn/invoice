import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api";

export function useSystemSeedMutation() {
  return useMutation({
    mutationFn() {
      return fetch(endpoint("sys.seed"), { method: "POST" });
    },
    onSuccess() {
      queryClient.invalidateQueries(); // simpler to just invalidate all queries than selectively
    },
  });
}
