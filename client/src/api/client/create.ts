import { useMutation } from "@tanstack/react-query";
import {
  CLIENT_LIST_QUERY_KEY,
  type CreateContact,
  endpoint,
  queryClient,
} from "api";

export type CreateClient = {
  name: string;
  description: string;
  contact: CreateContact;
};

export function useClientCreateMutation() {
  return useMutation({
    mutationFn(client: CreateClient) {
      return fetch(endpoint("client.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CLIENT_LIST_QUERY_KEY });
    },
  });
}
