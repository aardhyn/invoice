import { useState, MouseEvent } from "react";
import {
  LINE_ITEM_TYPE,
  type Invoice,
  type LineItemType,
  type CreateLineItem,
  type CreateProductLineItem,
  type CreateServiceLineItem,
  useClientListQuery,
  useProductListQuery,
  useServiceListQuery,
  useDraftInvoiceMutation,
} from "api";
import {
  Json,
  LineItemMetaForm,
  ProductLineItemForm,
  ServiceLineItemForm,
} from "component";
import { map, invariant, uuid, capitalize, toTimestampz } from "common";

export function DraftInvoiceMutationForm({ invoice }: { invoice: Invoice }) {
  const clientList = useClientListQuery({
    business_id: invoice.business.business_id,
  });

  const [address, setAddress] = useState<string | undefined>(
    invoice.location?.address || "",
  );
  const [suburb, setSuburb] = useState<string | undefined>(
    invoice.location?.suburb || "",
  );
  const [city, setCity] = useState<string | undefined>(
    invoice.location?.city || "",
  );

  const isLocationRequired = !!address || !!suburb || !!city;

  const draftInvoiceMutation = useDraftInvoiceMutation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const client = parseInt(form.get("client_id") as string);
    const dueDate = (form.get("due_date") || undefined) as string | undefined;

    const hasLocation = !!form.get("address") && !!form.get("city");
    const location = hasLocation
      ? {
          address: form.get("address") as string,
          suburb: (form.get("suburb") as string) || null,
          city: form.get("city") as string,
        }
      : undefined;
    console.log(location);

    draftInvoiceMutation.mutate({
      invoice_id: invoice.invoice_id,
      name: form.get("name") as string,
      description: form.get("description") as string,
      client,
      location,
      due_date: map(dueDate, toTimestampz),
    });
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={invoice.name} />
      </label>
      <br />
      <label>
        Description
        <textarea name="description" defaultValue={invoice.description ?? ""} />
      </label>
      <br />
      <label>
        Reference
        <input type="text" name="name" defaultValue={invoice.reference ?? ""} />
      </label>
      <br />
      <fieldset>
        <legend>Location</legend>
        <label>
          Street
          <input
            type="text"
            name="address"
            value={address}
            required={isLocationRequired}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Suburb
          <input
            type="text"
            name="suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
        </label>
        <br />
        <label>
          City
          <input
            type="text"
            name="city"
            required={isLocationRequired}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
      </fieldset>
      <br />
      <label>
        Due Date
        <input
          type="date"
          name="due_date"
          defaultValue={invoice.due_date?.split("T")[0]}
        />
      </label>
      <br />
      <fieldset>
        <legend>Line Items</legend>
        <LineItems
          items={invoice.line_items}
          onChange={console.log}
          onRemove={console.log}
        />
        {!invoice.line_items.length && <p>No Items</p>}
        <br />
        <fieldset>
          <legend>Add Line Item</legend>
        </fieldset>
      </fieldset>
      <br />
      <br />
      <label>
        Client
        {clientList.isSuccess && (
          <select
            name="client_id"
            defaultValue={invoice.client?.client_id.toString()}
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
      {draftInvoiceMutation.isError && (
        <Json>{draftInvoiceMutation.error}</Json>
      )}
      <br />
      <button type="submit">Update</button>
    </form>
  );
}

function LineItems({
  items,
  onChange: handleChange,
  onRemove: handleRemove,
}: {
  onChange: (index: number, item: CreateLineItem) => void;
  onRemove: (index: number) => void;
  items: CreateLineItem[];
}) {
  const handleClick = (index: number) => () => {
    handleRemove(index);
  };

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={item.key}>
            <LineItemMetaForm
              meta={{
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                custom_fields: item.custom_fields,
              }}
              onMetaChange={(meta) => handleChange(index, { ...item, ...meta })}
            />
            <button type="button" onClick={handleClick(index)}>
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function CreateLineItemForm({
  business_id,
  onCreateLineItem: handleCreateLineItem,
}: {
  business_id: number;
  onCreateLineItem: (item: CreateLineItem) => void;
}) {
  const [type, setType] = useState<"product" | "service">("product");

  const productListQuery = useProductListQuery(
    { business_id },
    type === "product",
  );
  const serviceListQuery = useServiceListQuery(
    { business_id },
    type === "service",
  );

  const [item, setItem] = useState<Omit<CreateLineItem, "key">>({
    name: "",
    description: "",
    quantity: 1,
    custom_fields: [],
    detail: undefined,
  });
  const clear = () => {
    setItem({
      name: "",
      description: "",
      quantity: 1,
      custom_fields: [],
      detail: undefined,
    });
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    invariant(name, "Detail must be set");
    handleCreateLineItem({
      key: uuid(),
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      detail: item.detail,
      custom_fields: item.custom_fields,
    });
    clear();
  };

  return (
    <>
      <LineItemMetaForm
        meta={{
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          custom_fields: item.custom_fields,
        }}
        onMetaChange={(meta) => setItem({ ...item, ...meta })}
      />
      <br />
      <fieldset>
        <legend>Service/Product</legend>
        <TypeDropdown type={type} onTypeChange={setType} />
        {type === "product" && (
          <ProductLineItemForm
            products={productListQuery.data?.data || []}
            selectedProductId={
              (item.detail as CreateProductLineItem)?.product_id
            }
            onProductIdChange={(product_id) =>
              setItem({ ...item, detail: { product_id } })
            }
          />
        )}
        {type === "service" && (
          <ServiceLineItemForm
            services={serviceListQuery.data?.data || []}
            selectedServiceId={
              (item.detail as CreateServiceLineItem)?.service_id
            }
            onServiceIdChange={(service_id) =>
              setItem({ ...item, detail: { service_id } })
            }
          />
        )}
      </fieldset>
      <br />
      <button type="button" onClick={handleClick}>
        Add
      </button>
    </>
  );
}

function TypeDropdown({
  type,
  onTypeChange: handleTypeChange,
}: {
  type: LineItemType;
  onTypeChange(type: LineItemType): void;
}) {
  return (
    <select
      value={type}
      onChange={(e) => {
        handleTypeChange(e.target.value as LineItemType);
      }}
    >
      {LINE_ITEM_TYPE.map((type) => (
        <option key={type} value={type}>
          {capitalize(type)}
        </option>
      ))}
    </select>
  );
}
