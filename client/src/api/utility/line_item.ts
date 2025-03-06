import { type Override, type Simplify, Uuid, uuid } from "common";

export type LineItemCustomFieldData = string | number | boolean;
export type LineItemCustomField = {
  key: string;
  name: string;
  data: LineItemCustomFieldData;
};

export type ServiceLineItem = {
  service_id: number; // fixme: This will be a string uuid eventually
  initial_rate: number;
  initial_rate_threshold: number;
  rate: number;
};

export type ProductLineItem = {
  product_id: number; // fixme: This will be a string uuid eventually
  unit_cost: number;
};

/** Does the detail of the line item contain product information?  */
export function isProductLineItem(
  item: Pick<LineItem, "detail">,
): item is Override<LineItem, { detail: ProductLineItem }> {
  return !!item.detail && "product_id" in item.detail;
}
/** Does the detail of the line item contain service information? */
export function isServiceLineItem(
  item: Pick<LineItem, "detail">,
): item is Override<LineItem, { detail: ServiceLineItem }> {
  return !!item.detail && "service_id" in item.detail;
}
/** Is this a freestanding generic line item (no `product` or `service` information) */
export function isGenericLineItem(
  item: Pick<LineItem, "detail">,
): item is Override<LineItem, { detail: undefined }> {
  return !item.detail;
}

export type LineItem = {
  key: string;
  name: string;
  description?: string;
  detail?: ServiceLineItem | ProductLineItem;
  custom_fields?: LineItemCustomField[];
  quantity?: number;
  total: number;
};

export type CreateServiceLineItem = Pick<ServiceLineItem, "service_id">;
export type CreateProductLineItem = Pick<ProductLineItem, "product_id">;
export type CreateLineItem = Simplify<
  Override<
    Omit<LineItem, "total">,
    { detail?: CreateServiceLineItem | CreateProductLineItem }
  >
>;

export const LINE_ITEM_TYPE = ["product", "service"] as const;
export type LineItemType = (typeof LINE_ITEM_TYPE)[number];

export type MutableLineItem = Simplify<Partial<Omit<CreateLineItem, "key">>>;
export type KeyedMutableLineItem = Simplify<{ key: Uuid } & MutableLineItem>;

export const DEFAULT_LINE_ITEM = (): CreateLineItem => ({
  key: uuid(),
  name: "",
  description: "",
  quantity: 1,
  custom_fields: [],
});
