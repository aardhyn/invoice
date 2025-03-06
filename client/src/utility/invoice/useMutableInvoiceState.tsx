import { produce } from "immer";
import { useState } from "react";
import { type Override, type Simplify, useDebounce } from "common";
import { useMutableInvoiceLineItemsState } from "utility";
import {
  type Invoice,
  type MutableDraftInvoice,
  type KeyedMutableDraftInvoice,
  useDraftInvoiceMutation,
} from "api";

const INVOICE_DEBOUNCE_DELAY = 1000;

/**
 * An `Invoice` with its mutable fields (the keys of `MutableDraftInvoice`) overridden with those in `MutableDraftInvoice`.
 */
type MutableDraftInvoiceState = Simplify<
  Override<Invoice, MutableDraftInvoice>
>;

/**
 * Manage the local state of a mutable draft invoice and its line items.
 */
export function useMutableInvoiceState(initialInvoice: Invoice) {
  const draftInvoiceMutation = useDraftInvoiceMutation();
  const handleInvoiceMutation = useDebounce(
    (mutation: KeyedMutableDraftInvoice) => {
      draftInvoiceMutation.mutate(mutation);
    },
    INVOICE_DEBOUNCE_DELAY,
  );

  const [invoice, setInvoice] = useState<MutableDraftInvoiceState>(() => {
    return {
      ...initialInvoice,
      client: initialInvoice.client?.client_id,
    };
  });

  const lineItems = useMutableInvoiceLineItemsState(initialInvoice.line_items, {
    invoiceId: initialInvoice.invoice_id,
  });

  const mutateInvoice = (mutation: MutableDraftInvoice) => {
    const next = produce(invoice, (draft) => Object.assign(draft, mutation));
    setInvoice(next);
    handleInvoiceMutation({ ...mutation, invoice_id: invoice.invoice_id });
  };

  return { invoice, mutateInvoice, lineItems };
}
