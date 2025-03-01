import { FormEvent, useState } from "react";
import { produce } from "immer";
import type {
  LineItemCustomField,
  ServiceListItem,
  ProductListItem,
  LineItem,
} from "api";
import { uuid } from "common";

type LineItemMeta = Pick<
  LineItem,
  "name" | "description" | "quantity" | "custom_fields"
>;

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
      <fieldset>
        <legend>Custom Fields</legend>
        {!meta.custom_fields.length && <p>No custom fields</p>}
        <br />
        <LineItemCustomFieldsForm
          customFields={meta.custom_fields}
          onCustomFieldsChange={(custom_fields) =>
            onMetaChange({ custom_fields })
          }
        />
      </fieldset>
    </div>
  );
}

/**
 * Generic line item custom field form for creating or editing a line item custom field
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
        <LineItemNewCustomFieldForm
          onCreateNewCustomField={handleAddCustomField}
        />
      </fieldset>
    </>
  );
}

function getTypeDefaultValue(type: LineItemCustomField["type"]) {
  return {
    boolean: false,
    number: 0,
    string: "",
  }[type];
}

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

  const handleTypeChange = (e: FormEvent<HTMLSelectElement>) => {
    const nextType = e.currentTarget.value as "string" | "number" | "boolean";
    const nextData = getTypeDefaultValue(nextType);
    onCustomFieldChange({
      ...customField,
      type: nextType,
      data: nextData,
    });
  };

  return (
    <>
      <input
        name="name"
        type="text"
        value={customField.name}
        onChange={handleChange}
      />
      <select name="type" value={customField.type} onChange={handleTypeChange}>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
      </select>
      {customField.type === "boolean" && (
        <input
          name="data"
          type="checkbox"
          checked={customField.data as boolean}
          onChange={(e) =>
            onCustomFieldChange({
              ...customField,
              data: e.currentTarget.checked,
            })
          }
        />
      )}
      {customField.type === "number" && (
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
      {customField.type === "string" && (
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

const DEFAULT_CUSTOM_FIELD_TYPE = "string";
function createDefaultCustomField(): LineItemCustomField {
  return {
    key: uuid(),
    name: "",
    type: DEFAULT_CUSTOM_FIELD_TYPE,
    data: getTypeDefaultValue(DEFAULT_CUSTOM_FIELD_TYPE),
  };
}

function LineItemNewCustomFieldForm({
  onCreateNewCustomField: handleCreateNewCustomField,
}: {
  onCreateNewCustomField: (field: LineItemCustomField) => void;
}) {
  const [customField, setCustomField] = useState<LineItemCustomField>(
    createDefaultCustomField(),
  );

  const handelCreate = () => {
    handleCreateNewCustomField(customField);
    const blankCustomField = createDefaultCustomField();
    setCustomField(blankCustomField);
  };

  return (
    <>
      <LineItemCustomFieldForm
        customField={customField}
        onCustomFieldChange={setCustomField}
      />
      <button type="button" onClick={handelCreate}>
        Add
      </button>
    </>
  );
}

/**
 * Generic line item form for creating or editing a line item
 */
export function ServiceLineItemForm({
  services,
  selectedServiceId,
  onServiceIdChange,
}: {
  services: ServiceListItem[];
  selectedServiceId?: number;
  onServiceIdChange: (service_id: number) => void;
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
export function ProductLineItemForm({
  products,
  selectedProductId,
  onProductIdChange,
}: {
  products: ProductListItem[];
  selectedProductId?: number;
  onProductIdChange: (product_id: number) => void;
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
