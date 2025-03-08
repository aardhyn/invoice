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
 * Format `invoice` as returned from the API to a mutable version for local state and mutation
 */
function createInvoiceState(invoice: Invoice): MutableDraftInvoiceState {
  return {
    ...invoice,
    client: invoice.client?.clientId,
  };
}

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

  const [invoice, setInvoice] = useState<MutableDraftInvoiceState>(
    createInvoiceState(initialInvoice),
  );

  const lineItems = useMutableInvoiceLineItemsState(initialInvoice.lineItems, {
    invoiceId: invoice.invoiceId,
  });

  const mutateInvoice = (mutation: MutableDraftInvoice) => {
    const next = produce(invoice, (draft) => Object.assign(draft, mutation));
    setInvoice(next);
    handleInvoiceMutation({ ...mutation, invoiceId: invoice.invoiceId });
  };

  return { invoice, mutateInvoice, lineItems };
}
