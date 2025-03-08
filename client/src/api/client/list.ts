import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint } from "api";
import { CLIENT_LIST_QUERY_KEY } from ".";

export type ClientListParams = {
  businessId: number;
};

export type ClientListItem = {
  clientId: number;
  name: string;
  description: string;
};

export function useClientListQuery(params: ClientListParams) {
  return useQuery<APIResponse<ClientListItem[], string>>({
    queryKey: CLIENT_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("client.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data;
    },
  });
}
