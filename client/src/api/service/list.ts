import { useQuery } from "@tanstack/react-query";
import { SERVICE_LIST_QUERY_KEY, APIResponse, endpoint } from "api";

export type ServiceListParams = {
  businessId: number;
};

export type ServiceListItem = {
  serviceId: number;
  name: string;
};

export function useServiceListQuery(params: ServiceListParams, enabled: boolean = true) {
  return useQuery<APIResponse<ServiceListItem[], string>>({
    queryKey: SERVICE_LIST_QUERY_KEY,
    enabled,
    async queryFn() {
      const response = await fetch(endpoint("service.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data;
    },
  });
}
