import type { LineItem, ProductLineItem, ServiceLineItem } from "api";

export const DEFAULT_DISPLAY_COLUMNS = [
  "name",
  "description",
  "quantity",
] satisfies (keyof LineItem)[];

export const PRODUCT_DISPLAY_COLUMNS = [
  "cost",
] satisfies (keyof ProductLineItem)[];

export const SERVICE_DISPLAY_COLUMNS = [
  "initial_rate",
  "rate",
] satisfies (keyof ServiceLineItem)[];
