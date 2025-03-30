import { useQuery } from "@tanstack/react-query";
import {
  INVOICE_TEMPLATE_LIST_QUERY_KEY,
  type Location,
  isAPIResponse,
  endpoint,
} from "api";
import { invariant } from "common";

export type InvoiceTemplateListParams = {
  businessId: number;
};

export type InvoiceTemplate = {
  invoiceId: number;
  name: string;
  description: string | null;
  location: Location | null;
  clientName: string | null;
};

export function useInvoiceTemplateListQuery(params: InvoiceTemplateListParams) {
  return useQuery<InvoiceTemplate[]>({
    queryKey: INVOICE_TEMPLATE_LIST_QUERY_KEY,
    async queryFn() {
      const res = await fetch(endpoint("invoice.template.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      invariant(isAPIResponse<InvoiceTemplate[]>(data), "Invalid API response");
      if (data.error !== null) throw new Error(JSON.stringify(data.error));
      return data.data;
    },
  });
}
