import { useQuery } from "@tanstack/react-query";
import { BUSINESS_QUERY_KEY, type Business, isAPIResponse, endpoint } from "api";
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

      invariant(isAPIResponse<Business>(data), "API response is not in the correct shape");

      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
  });
}
