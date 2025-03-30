import { type Override, type Simplify, type Uuid, uuid } from "common";

export type LineItemCustomFieldData = string | number | boolean;
export type LineItemCustomField = {
  key: string;
  name: string;
  data: LineItemCustomFieldData;
};

// fixme: Pick<Service> when service type is implemented
export type ServiceLineItem = {
  serviceId: number; // fixme: This will be a string uuid eventually
  initialRate: number;
  initialRateThreshold: number;
  rate: number;
};

// fixme: Pick<Service> when service type is implemented
export type ProductLineItem = {
  productId: number; // fixme: This will be a string uuid eventually
  unitCost: number;
};

/** Does the detail of the line item contain product information?  */
export function isProductLineItem(item: Pick<LineItem, "detail">): item is Override<LineItem, { detail: ProductLineItem }> {
  return !!item.detail && "productId" in item.detail;
}
/** Does the detail of the line item contain service information? */
export function isServiceLineItem(item: Pick<LineItem, "detail">): item is Override<LineItem, { detail: ServiceLineItem }> {
  return !!item.detail && "serviceId" in item.detail;
}
/** Is this a freestanding generic line item (no `product` or `service` information) */
export function isGenericLineItem(item: Pick<LineItem, "detail">): item is Override<LineItem, { detail: null }> {
  return !item.detail;
}

export type LineItem = {
  key: string;
  name: string;
  description?: string;
  detail: ServiceLineItem | ProductLineItem | null;
  customFields: LineItemCustomField[] | null;
  quantity: number;
  total: number;
};

export type CreateServiceLineItem = Pick<ServiceLineItem, "serviceId">;
export type CreateProductLineItem = Pick<ProductLineItem, "productId">;
export type CreateLineItem = Simplify<
  Override<Omit<LineItem, "total">, { detail?: CreateServiceLineItem | CreateProductLineItem | null }>
>;

export const LINE_ITEM_TYPE = ["product", "service", "ad_hoc"] as const;
export type LineItemType = (typeof LINE_ITEM_TYPE)[number];

export type MutableLineItem = Simplify<Partial<Omit<CreateLineItem, "key">>>;
export type KeyedMutableLineItem = Simplify<{ key: Uuid } & MutableLineItem>;

export const DEFAULT_LINE_ITEM = (): CreateLineItem => ({
  key: uuid(),
  name: "",
  description: "",
  quantity: 1,
  customFields: [],
});
