import { useMutation } from "@tanstack/react-query";
import {
  endpoint,
  isAPIResponse,
  queryClient,
  SERVICE_LIST_QUERY_KEY,
} from "api";
import { invariant } from "common";

export type CreateService = {
  name: string;
  description: string;
  businessId: number;
  initialRate?: number;
  initialRateThreshold?: number;
  rate: number;
};

export type CreatedService = {
  serviceId: number;
  name: string;
};

export function useServiceCreateMutation() {
  return useMutation({
    async mutationFn(service: CreateService) {
      const response = await fetch(endpoint("service.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });
      const data = await response.json();

      invariant(
        isAPIResponse<CreatedService>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: SERVICE_LIST_QUERY_KEY });
    },
  });
}
