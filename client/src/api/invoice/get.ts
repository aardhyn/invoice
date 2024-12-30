import { useQuery } from "@tanstack/react-query";
import {
  type Client,
  type Location,
  type Payment,
  type Timestampz,
  endpoint,
  isAPIResponse,
  type LineItem,
  type Business,
  INVOICE_QUERY_KEY,
} from "api";
import { invariant } from "common";

export type InvoiceGet = {
  invoice_id: number;
  invoice_key: string;
  name: string;
  description: string | null;
  reference: string | null;
  due_date: Timestampz;
  line_items: LineItem[];
  business: Business;
  payment: Payment;
  client: Client;
  location: Location;
};

export function useInvoiceGetQuery(invoiceId: number) {
  return useQuery({
    queryKey: [...INVOICE_QUERY_KEY, invoiceId],
    async queryFn() {
      const res = await fetch(endpoint("invoice.get"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      const data = await res.json();

      invariant(
        isAPIResponse<InvoiceGet>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
  });
}
