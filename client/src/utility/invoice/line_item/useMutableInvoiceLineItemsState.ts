import { produce } from "immer";
import { useState } from "react";
import {
  type CreateLineItem,
  type KeyedMutableLineItem,
  useLineItemCreateMutation,
  useLineItemDeleteMutation,
  useLineItemMutation,
} from "api";
import { type Uuid, invariant, useDebounce, useStateEffect } from "common";

const LINE_ITEM_DEBOUNCE_DELAY = 1000;

type StagedMutations = Record<Uuid, KeyedMutableLineItem>;

/**
 * Manage the state of line items from a mutable draft invoice. Handle the
 * Persisting of changes to the server efficiently.
 */
export function useMutableInvoiceLineItemsState(
  initialLineItems: KeyedMutableLineItem[] = [],
  { invoiceId }: { invoiceId: number },
) {
  const lineItemMutation = useLineItemMutation();
  const save = useDebounce((stagedMutations: StagedMutations) => {
    if (!Object.keys(stagedMutations).length) return; // prevent empty mutations from being saved && infinite loop after initial save
    Object.values(stagedMutations).forEach((mutation) => {
      lineItemMutation.mutate({ invoiceId, mutation });
    });
    setStagedMutations({});
  }, LINE_ITEM_DEBOUNCE_DELAY);

  const [items, setItems] = useState(initialLineItems);
  const [_, setStagedMutations] = useStateEffect<StagedMutations>({}, save); // issue delayed save on change

  const lineItemCreateMutation = useLineItemCreateMutation();
  const handleCreateLineItem = (lineItem: CreateLineItem) => {
    lineItemCreateMutation.mutate({ invoiceId, lineItem });
  };

  const lineItemDeleteMutation = useLineItemDeleteMutation();
  const handleDeleteLineItem = (key: Uuid) => {
    lineItemDeleteMutation.mutate({ invoiceId, lineItemKey: key });
  };

  const add = (lineItem: CreateLineItem) => {
    setItems(
      produce(items, (draft) => {
        draft.push(lineItem);
        handleCreateLineItem(lineItem);
      }),
    );
  };

  const removedStaged = (key: Uuid) => {
    // prevent a staged mutation from being saved if the line item has been deleted locally
    setStagedMutations((stagedMutations) =>
      produce(stagedMutations, (draft) => {
        delete draft[key];
      }),
    );
  };
  const remove = (key: Uuid) => {
    setItems(
      produce(items, (draft) => {
        const index = draft.findIndex((item) => item.key === key);
        invariant(index !== -1, "Line item not found");
        draft.splice(index, 1);
        removedStaged(key);
        handleDeleteLineItem(key);
      }),
    );
  };

  const mutateStaged = (mutation: KeyedMutableLineItem) => {
    setStagedMutations((stagedMutations) =>
      produce(stagedMutations, (draft) => {
        draft[mutation.key] = { ...draft[mutation.key], ...mutation }; // todo: `Object.assign`?
      }),
    );
  };
  const mutate = (mutation: KeyedMutableLineItem) => {
    const next = produce(items, (draft) => {
      const index = draft.findIndex((item) => item.key === mutation.key);
      invariant(index !== -1, "Line item not found");
      draft[index] = { ...draft[index], ...mutation };
      mutateStaged(mutation);
    });
    setItems(next);
  };

  return { items, add, mutate, remove };
}
