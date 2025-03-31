import { useMutation } from "@tanstack/react-query";
import { endpoint, isAPIResponse, queryClient } from "api";
import { invariant } from "common";

export function useSystemSeedMutation() {
  return useMutation({
    async mutationFn() {
      const res = await fetch(endpoint("sys.seed"), {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      invariant(isAPIResponse<{ thing: false }>(data), "Response body is malformed");
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries(); // simpler to just invalidate all queries than selectively
    },
  });
}
