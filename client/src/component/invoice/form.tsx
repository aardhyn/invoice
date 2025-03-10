import { useEffect, useState } from "react";
import { type Uuid, map, splitTimestamp, capitalize } from "common";
import { useMutableInvoiceState } from "utility";
import {
  LINE_ITEM_TYPE,
  DEFAULT_LINE_ITEM,
  type Invoice,
  type Location,
  type LineItemType,
  type CreateLineItem,
  type MutableLineItem,
  type KeyedMutableLineItem,
  type CreateServiceLineItem,
  type CreateProductLineItem,
  useClientListQuery,
  useProductListQuery,
  useServiceListQuery,
} from "api";
import {
  LineItemCustomFieldsForm,
  LineItemMetaForm,
  LineItemProductSelectionForm,
  LineItemServiceSelectionForm,
} from "component";

function locationRequired(location?: Location | null) {
  return !!location?.address || !!location?.suburb || !!location?.city;
}

export function DraftInvoiceMutationForm({
  initialInvoice,
}: {
  initialInvoice: Invoice;
}) {
  const { invoice, mutate, lineItems } = useMutableInvoiceState(initialInvoice);

  const clientList = useClientListQuery({
    businessId: invoice.business.businessId,
  });

  const isLocationRequired = locationRequired(invoice.location);

  return (
    <form>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={invoice.name}
          onChange={(event) => {
            const name = event.target.value;
            mutate({ name });
          }}
        />
      </label>
      <br />
      <label>
        Description
        <textarea
          name="description"
          value={invoice.description ?? ""}
          onChange={(event) => {
            const description = event.target.value;
            mutate({ description });
          }}
        />
      </label>
      <br />
      <label>
        Reference
        <input
          type="text"
          name="reference"
          value={invoice.reference ?? ""}
          onChange={(event) => {
            const reference = event.target.value;
            mutate({ reference });
          }}
        />
      </label>
      <br />
      <fieldset>
        <legend>Location</legend>
        <label>
          Street
          <input
            type="text"
            name="address"
            value={invoice.location?.address ?? ""}
            required={isLocationRequired}
            onChange={(value) => {
              const address = value.target.value;
              mutate({
                location: {
                  city: invoice.location?.city ?? "",
                  address,
                  suburb: invoice.location?.suburb ?? null,
                },
              });
            }}
          />
        </label>
        <br />
        <label>
          Suburb
          <input
            type="text"
            name="suburb"
            value={invoice.location?.suburb ?? ""}
            onChange={(value) => {
              const suburb = value.target.value;
              mutate({
                location: {
                  city: invoice.location?.city ?? "",
                  address: invoice.location?.address ?? "",
                  suburb,
                },
              });
            }}
          />
        </label>
        <br />
        <label>
          City
          <input
            type="text"
            name="city"
            required={isLocationRequired}
            value={invoice.location?.city}
            onChange={(value) => {
              const city = value.target.value;
              mutate({
                location: {
                  city,
                  address: invoice.location?.address ?? "",
                  suburb: invoice.location?.suburb ?? null,
                },
              });
            }}
          />
        </label>
      </fieldset>
      <br />
      <label>
        Due Date
        <input
          type="date"
          name="due_date"
          defaultValue={map(invoice.dueDate, splitTimestamp)?.date}
        />
      </label>
      <br />
      <fieldset>
        <legend>Line Items</legend>
        <LineItemsForm
          businessId={initialInvoice.business.businessId}
          lineItems={lineItems.items}
          onMutate={lineItems.mutate}
          onDelete={lineItems.remove}
        />
        {lineItems.items.length && <p>No Items</p>}
        <fieldset>
          <legend>Add Line Item</legend>
          <CreateLineItemForm
            businessId={initialInvoice.business.businessId}
            onCreateLineItem={lineItems.add}
          />
        </fieldset>
      </fieldset>
      <br />
      <br />
      <label>
        Client
        {clientList.isSuccess && (
          <select
            name="clientId"
            value={initialInvoice.client?.clientId}
            onChange={(e) => {
              const client = parseInt(e.target.value);
              mutate({ client });
            }}
          >
            <option value="">Select Client</option>
            {clientList?.data?.data?.map(({ clientId, name }) => (
              <option key={clientId} value={clientId}>
                {name}
              </option>
            ))}
          </select>
        )}
      </label>
    </form>
  );
}

function LineItemsForm({
  businessId,
  lineItems,
  onMutate: handleMutate,
  onDelete: handleDelete,
}: {
  businessId: number;
  onMutate(mutation: KeyedMutableLineItem): void;
  onDelete(key: Uuid): void;
  lineItems: KeyedMutableLineItem[];
}) {
  const createClickHandler = (key: Uuid) => () => {
    handleDelete(key);
  };

  return (
    <ul>
      {lineItems.map((item) => {
        return (
          <li key={item.key}>
            <LineItemForm
              businessId={businessId}
              lineItem={item}
              onMutateLineItem={(mutation) => {
                handleMutate({
                  ...mutation,
                  key: item.key,
                });
              }}
            />
            <br />
            <button type="button" onClick={createClickHandler(item.key)}>
              Remove
            </button>
            <br />
            <br />
            <hr />
            <br />
          </li>
        );
      })}
    </ul>
  );
}

function getLineItemType(
  lineItem: KeyedMutableLineItem,
): LineItemType | undefined {
  return map(lineItem.detail, (detail) => {
    if ("productId" in detail) return "product";
    else if ("serviceId" in detail) return "service";
    else throw new Error("Unknown line item type");
  });
}

export function LineItemForm({
  businessId,
  lineItem = DEFAULT_LINE_ITEM(),
  onMutateLineItem: handleMutateLineItem,
}: {
  businessId: number;
  lineItem: KeyedMutableLineItem;
  onMutateLineItem: (item: MutableLineItem) => void;
}) {
  const [type, setType] = useState(getLineItemType(lineItem));
  useEffect(() => {
    const type = getLineItemType(lineItem);
    setType(type);
  }, [lineItem.detail]);

  const isProductType =
    type === "product" || (!!lineItem.detail && "productId" in lineItem.detail);
  const productListQuery = useProductListQuery({ businessId }, isProductType);

  const isServiceType =
    type === "service" || (!!lineItem.detail && "serviceId" in lineItem.detail);
  const serviceListQuery = useServiceListQuery({ businessId }, isServiceType);

  return (
    <>
      <LineItemMetaForm
        meta={{
          name: lineItem.name,
          description: lineItem.description,
          quantity: lineItem.quantity,
        }}
        onMetaChange={(meta) => {
          handleMutateLineItem(meta);
        }}
      />
      <br />
      <fieldset>
        <legend>Service/Product</legend>
        <TypeDropdown type={type} onTypeChange={setType} />
        {isProductType && (
          <LineItemProductSelectionForm
            products={productListQuery.data?.data || []}
            selectedProductId={
              (lineItem.detail as CreateProductLineItem)?.productId
            }
            onProductIdChange={(productId) => {
              handleMutateLineItem({
                detail: productId ? { productId } : null,
              });
            }}
          />
        )}
        {isServiceType && (
          <LineItemServiceSelectionForm
            services={serviceListQuery.data?.data || []}
            selectedServiceId={
              (lineItem.detail as CreateServiceLineItem)?.serviceId
            }
            onServiceIdChange={(serviceId) => {
              handleMutateLineItem({
                detail: serviceId ? { serviceId } : null,
              });
            }}
          />
        )}
      </fieldset>
      <br />
      <fieldset>
        <legend>Custom Fields</legend>
        {!lineItem.customFields?.length && <p>No custom fields</p>}
        <br />
        <LineItemCustomFieldsForm
          customFields={lineItem.customFields || []}
          onCustomFieldsChange={(customFields) => {
            handleMutateLineItem({
              customFields,
            });
          }}
        />
      </fieldset>
    </>
  );
}

function CreateLineItemForm({
  businessId,
  onCreateLineItem: handleCreateLineItem,
}: {
  businessId: number;
  onCreateLineItem(item: CreateLineItem): void;
}) {
  const [lineItem, setLineItem] = useState<CreateLineItem>(DEFAULT_LINE_ITEM());
  const handleSubmit = () => {
    handleCreateLineItem(lineItem);
    setLineItem(DEFAULT_LINE_ITEM());
  };

  return (
    <div>
      <LineItemForm
        businessId={businessId}
        lineItem={lineItem}
        onMutateLineItem={(mutation) => {
          setLineItem((lineItem) => ({ ...lineItem, ...mutation }));
        }}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

function TypeDropdown({
  type,
  onTypeChange: handleTypeChange,
}: {
  type?: LineItemType;
  onTypeChange(type: LineItemType): void;
}) {
  return (
    <select
      value={type || ""}
      onChange={(e) => {
        handleTypeChange(e.target.value as LineItemType);
      }}
    >
      <option value="">Select Type</option>
      {LINE_ITEM_TYPE.map((type) => (
        <option key={type} value={type}>
          {capitalize(type)}
        </option>
      ))}
    </select>
  );
}
