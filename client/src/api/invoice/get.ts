import { useQuery } from "@tanstack/react-query";
import {
  type Client,
  type Location,
  type Timestampz,
  endpoint,
  isAPIResponse,
  type LineItem,
  type Business,
  INVOICE_QUERY_KEY,
} from "api";
import { invariant } from "common";

export type InvoiceGetParams = {
  invoice_id: number;
};

export type Invoice = {
  invoice_id: number;
  invoice_key: string;
  name: string;
  description: string | null;
  reference: string | null;
  due_date: Timestampz;
  line_items: LineItem[];
  business: Business;
  client: Client;
  location: Location;
  total: number;
};

export function useInvoiceGetQuery(params: InvoiceGetParams) {
  return useQuery({
    queryKey: [...INVOICE_QUERY_KEY, params.invoice_id],
    async queryFn() {
      const res = await fetch(endpoint("invoice.get"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      invariant(
        isAPIResponse<Invoice>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
  });
}
