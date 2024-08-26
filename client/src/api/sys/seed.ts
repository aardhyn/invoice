import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api/config";

export function useSystemSeedMutation() {
  return useMutation({
    mutationFn() {
      return fetch(endpoint("sys.seed"), { method: "POST" });
    },
    onSuccess() {
      queryClient.invalidateQueries(); // yes, everything
    },
  });
}
