import { useEffect, useState } from "react";
import {
  LINE_ITEM_TYPE,
  DEFAULT_LINE_ITEM,
  type Invoice,
  type LineItemType,
  type CreateLineItem,
  type MutableLineItem,
  type KeyedMutableLineItem,
  type CreateServiceLineItem,
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
import { type Uuid, map, splitTimestamp, capitalize } from "common";
import { produce } from "immer";
import { useMutableInvoiceState } from "utility";

export function DraftInvoiceMutationForm({
  invoice: initialInvoice,
}: {
  invoice: Invoice;
}) {
  const clientList = useClientListQuery({
    business_id: initialInvoice.business.business_id,
  });

  const { invoice, mutateInvoice, lineItems } =
    useMutableInvoiceState(initialInvoice);

  const isLocationRequired =
    !!invoice.location?.address ||
    !!invoice.location?.suburb ||
    !!invoice.location?.city;

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
            mutateInvoice({ name });
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
            mutateInvoice({ description });
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
            mutateInvoice({ reference });
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
              mutateInvoice({
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
              mutateInvoice({
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
              mutateInvoice({
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
          defaultValue={map(invoice.due_date, splitTimestamp)?.date}
        />
      </label>
      <br />
      <fieldset>
        <legend>Line Items</legend>
        <LineItemsForm
          business_id={initialInvoice.business.business_id}
          lineItems={lineItems.items}
          onMutate={lineItems.mutate}
          onDelete={lineItems.remove}
        />
        {lineItems.items.length && <p>No Items</p>}
        <fieldset>
          <legend>Add Line Item</legend>
          <CreateLineItemForm
            business_id={initialInvoice.business.business_id}
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
            name="client_id"
            value={initialInvoice.client?.client_id}
            onChange={(e) => {
              const client = parseInt(e.target.value);
              mutateInvoice({ client });
            }}
          >
            <option value="">Select Client</option>
            {clientList?.data?.data?.map(({ client_id, name }) => (
              <option key={client_id} value={client_id}>
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
  business_id,
  lineItems,
  onMutate: handleMutate,
  onDelete: handleDelete,
}: {
  business_id: number;
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
              business_id={business_id}
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

export function LineItemForm({
  business_id,
  lineItem = DEFAULT_LINE_ITEM(),
  onMutateLineItem: handleMutateLineItem,
}: {
  business_id: number;
  lineItem: KeyedMutableLineItem;
  onMutateLineItem: (item: MutableLineItem) => void;
}) {
  const [type, setType] = useState<"product" | "service" | undefined>();

  useEffect(() => {
    const type = map(lineItem.detail, (detail) =>
      "product_id" in detail ? "product" : "service",
    );
    setType(type);
  }, [lineItem.detail]);

  const isProductType = type === "product";
  const productListQuery = useProductListQuery({ business_id }, isProductType);

  const isServiceType = type === "service";
  const serviceListQuery = useServiceListQuery({ business_id }, isServiceType);

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
        {lineItem.detail && "product_id" in lineItem.detail && (
          <LineItemProductSelectionForm
            products={productListQuery.data?.data || []}
            selectedProductId={lineItem.detail.product_id}
            onProductIdChange={(product_id) => {
              handleMutateLineItem(
                produce(lineItem, (draft) => {
                  draft.detail = { product_id };
                }),
              );
            }}
          />
        )}
        {lineItem.detail && "service_id" in lineItem.detail && (
          <LineItemServiceSelectionForm
            services={serviceListQuery.data?.data || []}
            selectedServiceId={
              (lineItem.detail as CreateServiceLineItem)?.service_id
            }
            onServiceIdChange={(service_id) => {
              handleMutateLineItem(
                produce(lineItem, (draft) => {
                  draft.detail = { service_id };
                }),
              );
            }}
          />
        )}
      </fieldset>
      <br />
      <fieldset>
        <legend>Custom Fields</legend>
        {!lineItem.custom_fields?.length && <p>No custom fields</p>}
        <br />
        <LineItemCustomFieldsForm
          customFields={lineItem.custom_fields || []}
          onCustomFieldsChange={(custom_fields) => {
            handleMutateLineItem(
              produce(lineItem, (draft) => {
                Object.assign(draft, { custom_fields });
              }),
            );
          }}
        />
      </fieldset>
    </>
  );
}

function CreateLineItemForm({
  business_id,
  onCreateLineItem: handleCreateLineItem,
}: {
  business_id: number;
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
        business_id={business_id}
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
