import { useMemo } from "react";
import {
  DEFAULT_DISPLAY_COLUMNS,
  PRODUCT_DISPLAY_COLUMNS,
  SERVICE_DISPLAY_COLUMNS,
} from "./constant";
import { LineItem, isProductLineItem, isServiceLineItem } from "api";
import { fromSnakeCase, toSentenceCase, dedupe } from "common";

export function useLineItemColumns(line_items: LineItem[]) {
  return useMemo(() => {
    const hasProduct = line_items.some(isProductLineItem);
    const hasService = line_items.some(isServiceLineItem);

    const standardColumns = [
      ...DEFAULT_DISPLAY_COLUMNS,
      ...(hasProduct ? PRODUCT_DISPLAY_COLUMNS : []),
      ...(hasService ? SERVICE_DISPLAY_COLUMNS : []),
    ] as string[];

    const customColumns = dedupe(
      line_items
        .flatMap(({ custom_fields }) => custom_fields ?? [])
        .map(({ name }) => name),
    );

    const formattedColumns = [...standardColumns, ...customColumns]
      .map(fromSnakeCase)
      .map(toSentenceCase);

    return { standardColumns, customColumns, formattedColumns };
  }, [line_items]);
}
