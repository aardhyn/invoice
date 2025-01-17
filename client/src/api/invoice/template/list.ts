import { useQuery } from "@tanstack/react-query";
import {
  type APIResponse,
  type Location,
  endpoint,
  INVOICE_TEMPLATE_LIST_QUERY_KEY,
} from "api";

export type InvoiceTemplate = Omit<Location, "location_id"> & {
  invoice_id: number;
  name: string;
  description: string | null;
  location: Location;
  client_name: string;
};

export function useInvoiceTemplateListQuery() {
  return useQuery<APIResponse<InvoiceTemplate[], string>>({
    queryKey: INVOICE_TEMPLATE_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("invoice.template.list"));
      const data = await response.json();
      return data;
    },
  });
}
