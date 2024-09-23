import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint } from "api";

export type InvoiceListItem = {
  invoice_id: number;
  name: string;
  description: string;
  due_date: string;
};

export function useInvoiceListQuery() {
  return useQuery<APIResponse<InvoiceListItem[], string>>({
    queryKey: ["invoice", "list"],
    async queryFn() {
      const response = await fetch(endpoint("invoice.list"));
      const data = await response.json();
      return data;
    },
  });
}
