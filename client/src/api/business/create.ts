import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api/config";

export type CreatePayment = {
  account_number: string;
  account_name: string;
};

export type Details = {
  name: string;
  description: string;
};

export type CreateLocation = {
  address: string;
  suburb: string;
  city: string;
};

export type CreateContact = {
  name: string;
  cell: string;
  email: string;
  location: CreateLocation;
};

export type CreateBusiness = Details &
  CreatePayment & {
    location: CreateLocation;
    contact: CreateContact;
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
