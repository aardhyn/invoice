import { useQuery } from "@tanstack/react-query";
import {
  INVOICE_QUERY_KEY,
  type Client,
  type Location,
  type LineItem,
  type Business,
  endpoint,
  isAPIResponse,
} from "api";
import { invariant, type Timestampz } from "common";

export type GetInvoice = {
  invoice_id: number;
};

export const INVOICE_STATES = ["draft", "sent", "paid"];
export type InvoiceState = (typeof INVOICE_STATES)[number];

export type Invoice = {
  invoice_id: number;
  invoice_key: string;
  name: string;
  description: string | null;
  reference: string | null;
  due_date: Timestampz | null;
  line_items: LineItem[];
  business: Business;
  client: Client | null;
  location: Location | null;
  state: InvoiceState;
  total: number;
};

export function useInvoiceGetQuery(params: GetInvoice) {
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
