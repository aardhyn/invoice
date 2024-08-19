import { useQuery } from "@tanstack/react-query";
import { endpoint } from "api/config";
import { APIResponse } from "../type";

export type ClientListItem = {
  client_id: number;
  name: string;
  description: string;
};

export function useClientListQuery() {
  return useQuery<APIResponse<ClientListItem[], string>>({
    queryKey: ["client", "list"],
    async queryFn() {
      const response = await fetch(endpoint("client.list"));
      const data = await response.json();
      return data;
    },
  });
}
