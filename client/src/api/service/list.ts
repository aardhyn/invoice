import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint, SERVICE_LIST_QUERY_KEY } from "api";

export type ServiceListParams = {
  business_id: number;
};

export type ServiceListItem = {
  service_id: number;
  name: string;
};

export function useServiceListQuery(
  params: ServiceListParams,
  enabled: boolean = true,
) {
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
