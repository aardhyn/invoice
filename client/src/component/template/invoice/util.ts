import { LineItem, isProductLineItem, isServiceLineItem } from "api";
import {
  DEFAULT_DISPLAY_COLUMNS,
  PRODUCT_DISPLAY_COLUMNS,
  SERVICE_DISPLAY_COLUMNS,
} from "./constant";

export function getLineItemColumns(line_items: LineItem[]) {
  const hasProduct = line_items.some(isProductLineItem);
  const hasService = line_items.some(isServiceLineItem);
  const customFields = line_items
    .flatMap(({ custom_fields }) => custom_fields ?? [])
    .map(({ name }) => name);

  return [
    ...DEFAULT_DISPLAY_COLUMNS,
    ...(hasProduct ? PRODUCT_DISPLAY_COLUMNS : []),
    ...(hasService ? SERVICE_DISPLAY_COLUMNS : []),
    ...customFields,
  ];
}
