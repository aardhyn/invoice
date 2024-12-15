import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint } from "api";
import { CLIENT_LIST_QUERY_KEY } from ".";

export type ClientListItem = {
  client_id: number;
  name: string;
  description: string;
};

export function useClientListQuery() {
  return useQuery<APIResponse<ClientListItem[], string>>({
    queryKey: CLIENT_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("client.list"));
      const data = await response.json();
      return data;
    },
  });
}
