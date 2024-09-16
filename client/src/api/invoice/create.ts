import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api/config";
import { CreateLocation } from "api/utility";

type Timestamp = string;

export type ServiceLineItem = object;

export type ProductLineItem = object;

export type LineItem = {
  key: string;
  name: string;
  description: string;
  detail: ServiceLineItem | ProductLineItem;
};

export type CreateInvoice = {
  name: string;
  description: string;
  business_id: number; // todo: replace with uuid (we don't expose primary keys)
  client_id: number; //         ''
  due_date: Timestamp;
  location: CreateLocation;
  line_items: LineItem[];
};

export function useCreateInvoiceMutation() {
  return useMutation({
    mutationFn(invoice: CreateInvoice) {
      return fetch(endpoint("invoice.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
}
