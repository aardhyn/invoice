import { useMutation } from "@tanstack/react-query";
import {
  CreateLineItem,
  CreateLocation,
  INVOICE_LIST_QUERY_KEY,
  Timestampz,
  endpoint,
  queryClient,
} from "api";

export type CreateInvoice = {
  name: string;
  description: string;
  business_id: number; // todo: replace with uuid (we don't expose primary keys)
  client_id: number; //         ''
  due_date: Timestampz;
  location: CreateLocation;
  line_items: CreateLineItem[];
};

export function useInvoiceCreateMutation() {
  return useMutation({
    mutationFn(invoice: CreateInvoice) {
      return fetch(endpoint("invoice.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: INVOICE_LIST_QUERY_KEY });
    },
  });
}
