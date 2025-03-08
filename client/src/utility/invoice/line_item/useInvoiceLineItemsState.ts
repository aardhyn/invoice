import { produce } from "immer";
import { useState } from "react";
import {
  type CreateLineItem,
  type KeyedMutableLineItem,
  useLineItemCreateMutation,
  useLineItemDeleteMutation,
  useLineItemMutation,
} from "api";
import { type Uuid, invariant, useDebounce } from "common";

const LINE_ITEM_DEBOUNCE_DELAY = 1000;

/**
 * Manage the state of line items from a mutable draft invoice
 */
export function useMutableInvoiceLineItemsState(
  initialLineItems: KeyedMutableLineItem[] = [],
  { invoiceId }: { invoiceId: number },
) {
  const [items, setItems] = useState(initialLineItems);

  const lineItemCreateMutation = useLineItemCreateMutation();
  const handleCreateLineItem = (lineItem: CreateLineItem) => {
    lineItemCreateMutation.mutate({ invoiceId, lineItem });
  };

  const lineItemDeleteMutation = useLineItemDeleteMutation();
  const handleDeleteLineItem = (key: Uuid) => {
    lineItemDeleteMutation.mutate({ invoiceId, lineItemKey: key });
  };

  const lineItemMutation = useLineItemMutation();
  const handleMutateLineItem = useDebounce((mutation: KeyedMutableLineItem) => {
    lineItemMutation.mutate({ invoiceId, mutation });
  }, LINE_ITEM_DEBOUNCE_DELAY);

  const add = (lineItem: CreateLineItem) => {
    setItems(
      produce(items, (draft) => {
        draft.push(lineItem);
        handleCreateLineItem(lineItem);
      }),
    );
  };

  const remove = (key: Uuid) => {
    setItems(
      produce(items, (draft) => {
        const index = draft.findIndex((item) => item.key === key);
        invariant(index !== -1, "Line item not found");
        draft.splice(index, 1);
        handleDeleteLineItem(key);
      }),
    );
  };

  const mutate = (mutation: KeyedMutableLineItem) => {
    const next = produce(items, (draft) => {
      const index = draft.findIndex((item) => item.key === mutation.key);
      invariant(index !== -1, "Line item not found");
      draft[index] = { ...draft[index], ...mutation };
    });
    setItems(next);
    handleMutateLineItem?.(mutation); // note: we just pass the touched fields to handler
  };

  return { items, add, mutate, remove };
}
