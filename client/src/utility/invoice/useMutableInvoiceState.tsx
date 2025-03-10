import { produce } from "immer";
import { useState } from "react";
import { useMutableInvoiceLineItemsState } from "utility";
import {
  type Override,
  type Simplify,
  useDebounce,
  useStateEffect,
} from "common";
import {
  type Invoice,
  type MutableDraftInvoice,
  useDraftInvoiceMutation,
} from "api";

const INVOICE_DEBOUNCE_DELAY = 500;

/**
 * An `Invoice` with its mutable fields (the keys of `MutableDraftInvoice`) overridden with those in `MutableDraftInvoice`.
 */
type MutableDraftInvoiceState = Simplify<
  Override<Invoice, Required<MutableDraftInvoice>>
>;

/**
 * Format `invoice` as returned from the API to a mutable version for local state and mutation
 */
function createInvoiceState(invoice: Invoice): MutableDraftInvoiceState {
  return {
    ...invoice,
    client: invoice.client?.clientId ?? null,
  };
}

/**
 * Manage the local state of a mutable draft invoice and its line items.
 */
export function useMutableInvoiceState(initialInvoice: Invoice) {
  const draftInvoiceMutation = useDraftInvoiceMutation();
  const save = useDebounce((stagedMutation: MutableDraftInvoice) => {
    if (!Object.keys(stagedMutation).length) return; // prevent empty mutations from being saved && infinite loop after initial save
    const { invoiceId } = initialInvoice;
    draftInvoiceMutation.mutate({ invoiceId, ...stagedMutation });
    setStagedMutation({});
  }, INVOICE_DEBOUNCE_DELAY);

  const [_, setStagedMutation] = useStateEffect<MutableDraftInvoice>({}, save); // subset of invoice with only changed mutable fields
  const [invoice, setInvoice] = useState<MutableDraftInvoiceState>(
    createInvoiceState(initialInvoice),
  );

  const lineItems = useMutableInvoiceLineItemsState(initialInvoice.lineItems, {
    invoiceId: invoice.invoiceId,
  });

  const mutate = (mutation: MutableDraftInvoice) => {
    setStagedMutation((staged) => ({ ...staged, ...mutation }));
    setInvoice((invoice) => ({ ...invoice, ...mutation }));
  };

  return { invoice, mutate, lineItems };
}
