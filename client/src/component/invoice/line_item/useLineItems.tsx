import { CreateLineItem } from "api";
import { useState } from "react";

/**
 * Manage the state of line items in an invoice form
 */
export function useLineItemsState() {
  const [items, setItems] = useState<CreateLineItem[]>([]);
  const add = (item: CreateLineItem) => {
    setItems([...items, item]);
  };
  const remove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const mutate = (index: number, mutation: Partial<CreateLineItem>) => {
    const next = items.map((item, i) => {
      return i === index ? { ...item, ...mutation } : item;
    });
    setItems(next);
  };
  return { items, add, mutate, remove };
}
