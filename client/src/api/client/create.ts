import { useMutation } from "@tanstack/react-query";
import {
  CLIENT_LIST_QUERY_KEY,
  type CreateContact,
  endpoint,
  isAPIResponse,
  queryClient,
} from "api";
import { invariant } from "common";

export type CreateClient = {
  businessId: number;
  name: string;
  description: string;
  contact: CreateContact;
};

export type CreatedClient = {
  clientId: number;
  name: string;
};

export function useClientCreateMutation() {
  return useMutation({
    async mutationFn(client: CreateClient) {
      const res = await fetch(endpoint("client.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      const data = await res.json();
      invariant(isAPIResponse<CreatedClient>(data), "Invalid response");
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CLIENT_LIST_QUERY_KEY });
    },
  });
}
