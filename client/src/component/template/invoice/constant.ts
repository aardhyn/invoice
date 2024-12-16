import type { LineItem, ProductLineItem, ServiceLineItem } from "api";

export const DEFAULT_DISPLAY_COLUMNS = [
  "name",
  "description",
  "quantity",
] satisfies (keyof LineItem)[];

export const PRODUCT_DISPLAY_COLUMNS = [
  "unit_cost",
  "cost",
] satisfies (keyof ProductLineItem)[];

export const SERVICE_DISPLAY_COLUMNS = [
  "initial_rate",
  "initial_rate_threshold",
  "rate",
] satisfies (keyof ServiceLineItem)[];
