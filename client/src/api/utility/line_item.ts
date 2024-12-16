import type { Override } from "common";

export type ServiceLineItem = {
  service_id: number; // fixme: This will be a string uuid eventually
  initial_rate: number;
  initial_rate_threshold: number;
  rate: number;
};

export type ProductLineItem = {
  product_id: number; // fixme: This will be a string uuid eventually
  unit_cost: number;
  cost: number;
};

export type LineItemCustomField = {
  key: string;
  name: string;
  type: "boolean" | "number" | "string";
  data: boolean | number | string;
};
// fixme: probably this is a better way to do this:
// & (
//   | { type: "boolean"; data: boolean }
//   | { type: "number"; data: number }
//   | { type: "text"; data: string }
// );

// Narrow LineItem to the three possible types based on `LineItem.detail`
export function isProductLineItem(
  item: LineItem,
): item is Override<LineItem, { detail: ProductLineItem }> {
  return !!item.detail && "product_id" in item.detail;
}
export function isServiceLineItem(
  item: LineItem,
): item is Override<LineItem, { detail: ServiceLineItem }> {
  return !!item.detail && "service_id" in item.detail;
}
export function isGenericLineItem(
  item: LineItem,
): item is Override<LineItem, { detail: undefined }> {
  return !item.detail;
}

export type LineItem = {
  key: string;
  name: string;
  description: string;
  detail?: ServiceLineItem | ProductLineItem;
  custom_fields: LineItemCustomField[];
  quantity: number;
  total: number;
};

// fixme: We let line items and custom fields be keyed clientside.

export type CreateServiceLineItem = Pick<ServiceLineItem, "service_id">;
export type CreateProductLineItem = Pick<ProductLineItem, "product_id">;
export type CreateLineItem = Override<
  Omit<LineItem, "total">,
  {
    detail: CreateServiceLineItem | CreateProductLineItem;
    custom_fields: LineItemCustomField[];
  }
>;

export const LINE_ITEM_TYPE = ["product", "service"] as const;
export type LineItemType = (typeof LINE_ITEM_TYPE)[number];
