import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient, CreateContact, CreateLocation } from "api";

export type CreateBusiness = {
  name: string;
  description: string;
  location: CreateLocation;
  contact: CreateContact;
  account_number: string;
  account_name: string;
};

export function useCreateBusinessMutation() {
  return useMutation({
    mutationFn(business: CreateBusiness) {
      return fetch(endpoint("business.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
}
