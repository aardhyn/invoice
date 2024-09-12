import { useMutation } from "@tanstack/react-query";
import { endpoint, queryClient } from "api/config";

export type AddLineItem = {
  invoice_id: number;
  description: string;
};

export function useAddLineItemMutation() {
  return useMutation({
    mutationFn(lineItem: AddLineItem) {
      return fetch(endpoint("invoice.line_item.add"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lineItem),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
}
