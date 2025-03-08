import { useMemo } from "react";
import { PRODUCT_DISPLAY_COLUMNS, SERVICE_DISPLAY_COLUMNS } from "./constant";
import { LineItem, isProductLineItem, isServiceLineItem } from "api";
import {
  fromSnakeCase,
  toSentenceCase,
  dedupe,
  stringifyBoolean,
} from "common";

export function useLineItemColumnNames(lineItems: LineItem[]) {
  return useMemo(() => {
    const hasProductColumns = lineItems.some(isProductLineItem);
    const hasServiceColumns = lineItems.some(isServiceLineItem);

    const standardColumns = [
      "name",
      "description",
      "quantity",
      ...(hasProductColumns ? PRODUCT_DISPLAY_COLUMNS : []),
      ...(hasServiceColumns ? SERVICE_DISPLAY_COLUMNS : []),
    ] as string[];

    const customColumns = dedupe(
      lineItems
        .flatMap(({ customFields }) => customFields ?? [])
        .map(({ name }) => name),
    );

    const formattedColumns = [...standardColumns, ...customColumns, "total"]
      .map(fromSnakeCase)
      .map(toSentenceCase);

    return {
      formattedColumns,
      customColumns,
      hasProductColumns,
      hasServiceColumns,
    };
  }, [lineItems]);
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
        const data = lineItem.customFields?.find(({ name: thisName }) => {
          return thisName === name;
        })?.data;
        const value = formatCellData(data);
        return value;
      }),
    [customFieldColumns, lineItem.customFields],
  );
}

// Format cell data for display
export function formatCellData(data: string | number | boolean | undefined) {
  if (data === undefined) return "";
  else if (typeof data === "boolean") return stringifyBoolean(data);
  else return data;
}
