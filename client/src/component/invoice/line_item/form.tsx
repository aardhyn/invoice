import { FormEvent, useState } from "react";
import { produce } from "immer";
import { uuid } from "common";
import type {
  LineItemCustomField,
  ServiceListItem,
  ProductListItem,
  MutableLineItem,
} from "api";

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
    <div>
      <label htmlFor="name">Name</label>
      <input
        name="name"
        placeholder="Name"
        type="text"
        value={meta.name}
        onChange={(e) => onMetaChange({ name: e.currentTarget.value })}
      />
      <br />
      <label htmlFor="description">Description</label>
      <input
        name="description"
        type="text"
        placeholder="Description"
        value={meta.description}
        onChange={(e) => onMetaChange({ description: e.currentTarget.value })}
      />
      <br />
      <label htmlFor="quantity">Quantity</label>
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={meta.quantity}
        onChange={(e) =>
          onMetaChange({ quantity: Number(e.currentTarget.value) })
        }
      />
      <br />
    </div>
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

  const handleRemoveCustomField = (index: number) => {
    onCustomFieldsChange(
      produce(customFields, (draft) => {
        draft.splice(index, 1);
      }),
    );
  };

  return (
    <>
      {customFields.map((field, index) => (
        <div key={field.key}>
          <LineItemCustomFieldForm
            customField={field}
            onCustomFieldChange={handleCustomFieldChange(index)}
          />
          <button type="button" onClick={() => handleRemoveCustomField(index)}>
            Remove
          </button>
        </div>
      ))}
      <fieldset>
        <legend>Add Custom Field</legend>
        <LineItemCreateCustomFieldForm
          onCreateNewCustomField={handleAddCustomField}
        />
      </fieldset>
    </>
  );
}

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
  onCustomFieldChange,
}: {
  customField: LineItemCustomField;
  onCustomFieldChange: (field: LineItemCustomField) => void;
}) {
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onCustomFieldChange({ ...customField, [name]: value });
  };

  return (
    <>
      <input
        name="name"
        type="text"
        value={customField.name}
        onChange={handleChange}
      />
      {typeof customField.data === "boolean" && (
        <input
          name="data"
          type="checkbox"
          checked={customField.data}
          onChange={(e) =>
            onCustomFieldChange({
              ...customField,
              data: e.currentTarget.checked,
            })
          }
        />
      )}
      {typeof customField.data === "number" && (
        <input
          name="data"
          type="number"
          value={customField.data as number}
          onChange={(e) =>
            onCustomFieldChange({
              ...customField,
              data: Number(e.currentTarget.value),
            })
          }
        />
      )}
      {typeof customField.data === "string" && (
        <input
          name="data"
          type="text"
          value={customField.data as string}
          onChange={(e) =>
            onCustomFieldChange({ ...customField, data: e.currentTarget.value })
          }
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
  const [customField, setCustomField] = useState<LineItemCustomField>(
    DEFAULT_LINE_ITEM_CUSTOM_FIELD(),
  );

  const handleSubmit = () => {
    handleCreateNewCustomField(customField);
    setCustomField(DEFAULT_LINE_ITEM_CUSTOM_FIELD());
  };

  return (
    <>
      <LineItemCustomFieldForm
        customField={customField}
        onCustomFieldChange={setCustomField}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
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
  onServiceIdChange(service_id: number): void;
}) {
  return (
    <>
      <select
        name="service_id"
        value={selectedServiceId}
        onChange={(e) => onServiceIdChange(Number(e.currentTarget.value))}
      >
        <option value={undefined}>Select a service</option>
        {services.map((service) => (
          <option key={service.service_id} value={service.service_id}>
            {service.name}
          </option>
        ))}
      </select>
    </>
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
  onProductIdChange(product_id: number): void;
}) {
  return (
    <>
      <select
        name="product_id"
        value={selectedProductId}
        onChange={(e) => onProductIdChange(Number(e.currentTarget.value))}
      >
        <option value={undefined}>Select a product</option>
        {products.map((product) => (
          <option key={product.product_id} value={product.product_id}>
            {product.name}
          </option>
        ))}
      </select>
    </>
  );
}
