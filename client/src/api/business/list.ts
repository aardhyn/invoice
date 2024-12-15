import { useQuery } from "@tanstack/react-query";
import { type APIResponse, BUSINESS_LIST_QUERY_KEY, endpoint } from "api";

export type BusinessListItem = {
  business_id: number;
  name: string;
  description: string;
};

export function useBusinessListQuery() {
  return useQuery<APIResponse<BusinessListItem[], string>>({
    queryKey: BUSINESS_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("business.list"));
      const data = await response.json();
      return data;
    },
  });
}
