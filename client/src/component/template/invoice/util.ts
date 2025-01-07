import { useMemo } from "react";
import { PRODUCT_DISPLAY_COLUMNS, SERVICE_DISPLAY_COLUMNS } from "./constant";
import { LineItem, isProductLineItem, isServiceLineItem } from "api";
import {
  fromSnakeCase,
  toSentenceCase,
  dedupe,
  stringifyBoolean,
} from "common";

export function useLineItemColumnNames(line_items: LineItem[]) {
  return useMemo(() => {
    const hasProduct = line_items.some(isProductLineItem);
    const hasService = line_items.some(isServiceLineItem);

    const standardColumns = [
      "name",
      "description",
      "quantity",
      ...(hasProduct ? PRODUCT_DISPLAY_COLUMNS : []),
      ...(hasService ? SERVICE_DISPLAY_COLUMNS : []),
    ] as string[];

    const customColumns = dedupe(
      line_items
        .flatMap(({ custom_fields }) => custom_fields ?? [])
        .map(({ name }) => name),
    );

    const formattedColumns = [...standardColumns, ...customColumns, "total"]
      .map(fromSnakeCase)
      .map(toSentenceCase);

    return {
      formattedColumns,
      customColumns,
    };
  }, [line_items]);
}

/**  Format custom fields for display
 * @example
 * [a][b][ ][ ]
 * [ ][b][c][ ]
 * [a][ ][c][d]
 */
export function useCustomFieldCells(
  lineItem: LineItem,
  customFieldColumns: string[],
) {
  return useMemo(
    () =>
      customFieldColumns.map((name) => {
        const data = lineItem.custom_fields.find(({ name: thisName }) => {
          return thisName === name;
        })?.data;
        const value = formatCellData(data);
        return value;
      }),
    [customFieldColumns, lineItem.custom_fields],
  );
}

// Format cell data for display
export function formatCellData(data: string | number | boolean | undefined) {
  if (data === undefined) {
    return "";
  } else if (typeof data === "boolean") {
    return stringifyBoolean(data);
  } else {
    return data;
  }
}
