import { useQuery } from "@tanstack/react-query";
import { type APIResponse, endpoint, INVOICE_LIST_QUERY_KEY } from "api";

export type ListInvoice = {
  business_id: number;
};

export type InvoiceListItem = {
  invoice_id: number;
  name: string;
  description: string;
  due_date: string;
};

export function useInvoiceListQuery(params: ListInvoice) {
  return useQuery<APIResponse<InvoiceListItem[], string>>({
    queryKey: INVOICE_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("invoice.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data;
    },
  });
}
