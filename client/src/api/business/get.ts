import { useQuery } from "@tanstack/react-query";
import {
  endpoint,
  isAPIResponse,
  BUSINESS_QUERY_KEY,
  type Business,
} from "api";
import { invariant } from "common";

type BusinessGetParams = {
  businessId: number;
};

export function useBusinessGetQuery(params: BusinessGetParams) {
  return useQuery({
    queryKey: [...BUSINESS_QUERY_KEY, params.businessId],
    async queryFn() {
      const res = await fetch(endpoint("business.get"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      invariant(
        isAPIResponse<Business>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
  });
}
