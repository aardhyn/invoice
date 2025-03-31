import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, type Location, endpoint, queryClient } from "api";
import type { Timestampz } from "common";

export type MutableDraftInvoice = {
  name?: string;
  description?: string | null;
  reference?: string | null;
  client?: number | null;
  location?: Location | null;
  dueDate?: Timestampz | null;
};

export type KeyedMutableDraftInvoice = MutableDraftInvoice & {
  invoiceId: number;
};

export type MutatedDraftInvoice = {
  invoiceId: number;
  name: string;
};

export function useDraftInvoiceMutation() {
  return useMutation<MutatedDraftInvoice, Error, KeyedMutableDraftInvoice>({
    async mutationFn(mutation) {
      const res = await fetch(endpoint("invoice.draft.mutate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mutation),
      });
      const data = await res.json();
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess({ invoiceId }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoiceId],
      });
    },
  });
}
