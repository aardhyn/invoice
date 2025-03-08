import { useQuery } from "@tanstack/react-query";
import { BUSINESS_LIST_QUERY_KEY, endpoint, isAPIResponse } from "api";
import { invariant } from "common";

export type BusinessListItem = {
  businessId: number;
  name: string;
  description: string;
};

export function useBusinessListQuery() {
  return useQuery<BusinessListItem[]>({
    queryKey: BUSINESS_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("business.list"), {
        method: "POST",
      });
      const data = await response.json();
      invariant(
        isAPIResponse<BusinessListItem[]>(data),
        "Invalid API response",
      );
      if (data.error) throw new Error(JSON.stringify(data.error));
      return data.data;
    },
  });
}
