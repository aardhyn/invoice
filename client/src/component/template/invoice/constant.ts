import type { LineItem, ProductLineItem, ServiceLineItem } from "api";

export const DEFAULT_DISPLAY_COLUMNS = [
  "name",
  "description",
  "quantity",
] satisfies (keyof LineItem)[];

export const PRODUCT_DISPLAY_COLUMNS = [
  "unitCost",
] satisfies (keyof ProductLineItem)[];

export const SERVICE_DISPLAY_COLUMNS = [
  "initialRate",
  "rate",
] satisfies (keyof ServiceLineItem)[];
