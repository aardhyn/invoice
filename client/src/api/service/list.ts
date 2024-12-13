import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint } from "api";

export type ServiceListItem = {
  service_id: number;
  name: string;
};

export function useServiceListQuery(enabled: boolean = true) {
  return useQuery<APIResponse<ServiceListItem[], string>>({
    queryKey: ["service"],
    enabled,
    async queryFn() {
      const response = await fetch(endpoint("service.list"));
      const data = await response.json();
      return data;
    },
  });
}
