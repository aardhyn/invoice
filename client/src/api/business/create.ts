import { useMutation } from "@tanstack/react-query";
import { BUSINESS_LIST_QUERY_KEY, type CreateContact, type Location, endpoint, queryClient, isAPIResponse } from "api";
import { invariant } from "common";

export type CreateBusiness = {
  name: string;
  description: string;
  location: Location;
  contact: CreateContact;
  accountNumber: string;
  accountName: string;
};

export type CreatedBusiness = {
  businessId: number;
  name: string;
};

export function useBusinessCreateMutation() {
  return useMutation({
    async mutationFn(business: CreateBusiness) {
      const res = await fetch(endpoint("business.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });
      const data = await res.json();
      invariant(isAPIResponse<CreatedBusiness>(data), "Invalid response");
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: BUSINESS_LIST_QUERY_KEY });
    },
  });
}
