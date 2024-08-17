import { useQuery } from "@tanstack/react-query";
import { endpoint } from "api/config";
import { APIResponse } from "../type";

export type BusinessListItem = {
  business_id: number;
  name: string;
  description: string;
};

export function useBusinessListQuery() {
  return useQuery<APIResponse<BusinessListItem[], string>>({
    queryKey: ["business", "list"],
    async queryFn() {
      const response = await fetch(endpoint("business.list"));
      const data = await response.json();
      return data;
    },
  });
}
