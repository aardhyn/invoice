import { FormEvent } from "react";
import { LineItemCustomField, ServiceListItem } from "api";
import { ProductListItem } from "../../../api/product/list";

/**
 * Generic line item form for creating or editing a line item
 */
export function LineItemForm({
  name = "",
  description = "",
  quantity,
  customFields,
  onNameChange,
  onDescriptionChange,
  onQuantityChange,
  onCustomFieldsChange,
}: {
  name: string;
  description: string;
  quantity: number;
  customFields: LineItemCustomField[];
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onQuantityChange: (quantity: number) => void;
  onCustomFieldsChange: (fields: LineItemCustomField[]) => void;
}) {
  const handleNameChange = (e: FormEvent<HTMLInputElement>) => {
    onNameChange(e.currentTarget.value);
  };
  const handleDescriptionChange = (e: FormEvent<HTMLInputElement>) => {
    onDescriptionChange(e.currentTarget.value);
  };

  return (
    <>
      <input name="name" type="text" value={name} onChange={handleNameChange} />
      <input
        name="description"
        type="text"
        value={description}
        onChange={handleDescriptionChange}
      />
      <input
        name="quantity"
        type="number"
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.currentTarget.value))}
      />
      <LineItemCustomFieldsForm
        customFields={customFields}
        onCustomFieldsChange={onCustomFieldsChange}
      />
    </>
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
        customFields.map((field, i) => (i === index ? mutation : field)),
      );
    };
  };

  return (
    <>
      {customFields.map((field, index) => (
        <LineItemCustomFieldForm
          key={index}
          customField={field}
          onCustomFieldChange={handleCustomFieldChange(index)}
        />
      ))}
    </>
  );
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
    // FIXME: attempt to coerce data to the new type...
    const nextData =
      nextType === "boolean" ? false : nextType === "number" ? 0 : "";
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
