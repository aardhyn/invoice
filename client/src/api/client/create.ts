import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api/config";
import { CreateContact } from "api/utility";

export type CreateClient = {
  name: string;
  description: string;
  contact: CreateContact;
};

export function useCreateClientMutation() {
  return useMutation({
    mutationFn(client: CreateClient) {
      return fetch(endpoint("client.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["client"] });
    },
  });
}
