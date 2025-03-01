import { useMutation } from "@tanstack/react-query";
import {
  BUSINESS_LIST_QUERY_KEY,
  endpoint,
  type CreateContact,
  type Location,
  queryClient,
} from "api";

export type CreateBusiness = {
  name: string;
  description: string;
  location: Location;
  contact: CreateContact;
  account_number: string;
  account_name: string;
};

export function useBusinessCreateMutation() {
  return useMutation({
    mutationFn(business: CreateBusiness) {
      return fetch(endpoint("business.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: BUSINESS_LIST_QUERY_KEY });
    },
  });
}
