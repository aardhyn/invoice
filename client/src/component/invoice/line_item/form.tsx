import { type FormEvent, useState } from "react";
import { produce } from "immer";
import { Flex, styled } from "panda/jsx";
import { uuid } from "common";
import type { LineItemCustomField, ServiceListItem, ProductListItem, MutableLineItem } from "api";
import { Button, Card, Checkbox, H5, Select, Spacer, Text, Textarea, TextField } from "component";

type MetaFields = "name" | "description" | "quantity";
type LineItemMeta = Pick<MutableLineItem, MetaFields>;

/**
 * Generic line item form for creating or editing a line item
 */
export function LineItemMetaForm({
  meta,
  onMetaChange,
}: {
  meta: LineItemMeta;
  onMetaChange: (meta: Partial<LineItemMeta>) => void;
}) {
  return (
    <>
      <TextField
        label="Name"
        name="name"
        placeholder="Name"
        value={meta.name}
        onValueChange={(name) => onMetaChange({ name })}
      />
      <Textarea
        label="Description"
        name="description"
        placeholder="Description"
        value={meta.description}
        onValueChange={(description) => onMetaChange({ description })}
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={meta.quantity?.toString()}
        onValueChange={(quantity) => onMetaChange({ quantity: Number(quantity) })}
      />
    </>
  );
}

/**
 * Custom field form for building or creating custom fields
 */
export function LineItemCustomFieldsForm({
  customFields,
  onCustomFieldsChange,
}: {
  customFields: LineItemCustomField[];
  onCustomFieldsChange: (fields: LineItemCustomField[]) => void;
}) {
  const handleCustomFieldChange = (index: number) => {
    return (mutation: LineItemCustomField) => {
      onCustomFieldsChange(
        produce(customFields, (draft) => {
          draft[index] = mutation;
        }),
      );
    };
  };

  const handleAddCustomField = (field: LineItemCustomField) => {
    onCustomFieldsChange(
      produce(customFields, (draft) => {
        draft.push(field);
      }),
    );
  };

  const handleCustomFieldDelete = (index: number) => {
    return () =>
      onCustomFieldsChange(
        produce(customFields, (draft) => {
          draft.splice(index, 1);
        }),
      );
  };

  return (
    <>
      <Card r="xs">
        <H5>Custom Fields</H5>
        <CustomFields>
          {customFields.map((field, index) => (
            <li key={field.key}>
              <Flex align="center" gap="md" wrap="wrap">
                <LineItemCustomFieldForm customField={field} onCustomFieldChange={handleCustomFieldChange(index)} />
                <Spacer greedy />
                <Button type="button" onClick={handleCustomFieldDelete(index)}>
                  Delete
                </Button>
              </Flex>
            </li>
          ))}
          {!customFields?.length && (
            <li>
              <Text color="2">No custom fields</Text>
            </li>
          )}
        </CustomFields>
        <H5>Create Custom Field</H5>
        <Flex align="end" gap="md" wrap="wrap">
          <LineItemCreateCustomFieldForm onCreateNewCustomField={handleAddCustomField} />
        </Flex>
      </Card>
    </>
  );
}
const CustomFields = styled("ul", { base: { spaceY: "md" } });

export const DEFAULT_LINE_ITEM_CUSTOM_FIELD = (): LineItemCustomField => ({
  key: uuid(),
  name: "",
  data: "",
});

/**
 * Custom field form for mutating or creating a custom field
 * // fixme: facilitate switching type (type a string: converts to string, vice versa)
 */
export function LineItemCustomFieldForm({
  customField,
  onCustomFieldChange: handleCustomFieldChange,
}: {
  customField: LineItemCustomField;
  onCustomFieldChange(field: LineItemCustomField): void;
}) {
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    handleCustomFieldChange({ ...customField, [name]: value });
  };

  return (
    <>
      <TextField name="name" label="Field Name" type="text" value={customField.name} onChange={handleChange} />
      {typeof customField.data === "boolean" && (
        <Checkbox
          name="data"
          label="Value"
          inline={false}
          checked={customField.data}
          onCheckedChange={(data) => {
            handleCustomFieldChange({ ...customField, data });
          }}
        />
      )}
      {typeof customField.data === "number" && (
        <TextField
          name="data"
          label="Value"
          type="number"
          value={customField.data}
          onValueChange={(data) => {
            handleCustomFieldChange({ ...customField, data: parseInt(data) });
          }}
        />
      )}
      {typeof customField.data === "string" && (
        <TextField
          name="data"
          label="Value"
          type="text"
          value={customField.data}
          onValueChange={(data) => {
            handleCustomFieldChange({ ...customField, data });
          }}
        />
      )}
    </>
  );
}

function LineItemCreateCustomFieldForm({
  onCreateNewCustomField: handleCreateNewCustomField,
}: {
  onCreateNewCustomField(field: LineItemCustomField): void;
}) {
  const [customField, setCustomField] = useState<LineItemCustomField>(DEFAULT_LINE_ITEM_CUSTOM_FIELD());

  const handleSubmit = () => {
    handleCreateNewCustomField(customField);
    setCustomField(DEFAULT_LINE_ITEM_CUSTOM_FIELD());
  };

  return (
    <>
      <LineItemCustomFieldForm customField={customField} onCustomFieldChange={setCustomField} />
      <Spacer greedy />
      <Button type="button" onClick={handleSubmit}>
        Add
      </Button>
    </>
  );
}

/**
 * Generic line item form for creating or editing a line item
 */
export function LineItemServiceSelectionForm({
  services,
  selectedServiceId,
  onServiceIdChange,
}: {
  services: ServiceListItem[];
  selectedServiceId?: number;
  onServiceIdChange(serviceId: number | null): void;
}) {
  return (
    <Select
      name="serviceId"
      label="Service"
      placeholder="Choose service"
      value={selectedServiceId?.toString()}
      onValueChange={(value) => {
        const serviceId = Number(value);
        onServiceIdChange(serviceId);
      }}
      options={
        services.map(({ serviceId, name }) => ({
          value: serviceId.toString(),
          label: name,
        })) ?? []
      }
    />
  );
}

/**
 * Generic line item form for creating or editing a line item
 */
export function LineItemProductSelectionForm({
  products,
  selectedProductId,
  onProductIdChange,
}: {
  products: ProductListItem[];
  selectedProductId?: number;
  onProductIdChange(productId: number | null): void;
}) {
  return (
    <Select
      name="productId"
      label="Product"
      placeholder="Choose product"
      value={selectedProductId?.toString()}
      onValueChange={(value) => {
        const productId = Number(value);
        onProductIdChange(productId);
      }}
      options={
        products.map(({ productId, name }) => ({
          value: productId.toString(),
          label: name,
        })) ?? []
      }
    />
  );
}
