import { MouseEvent, FormEvent, useCallback, useState } from "react";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import {
  type CreateLineItem,
  type CreateProductLineItem,
  type CreateServiceLineItem,
  useInvoiceListQuery,
  useClientListQuery,
  useBusinessListQuery,
  useInvoiceCreateMutation,
  useProductListQuery,
  useServiceListQuery,
  type LineItemType,
  type LineItemCustomField,
  LINE_ITEM_TYPE,
} from "api";
import {
  useLineItemsState as useCreateLineItemsState,
  LineItemForm,
  ProductLineItemForm,
  ServiceLineItemForm,
} from "component";
import { capitalize, invariant, uuid } from "common";

export const Route = createLazyFileRoute("/invoice")({
  component: Page,
});

function Page() {
  const invoiceList = useInvoiceListQuery();
  const clientList = useClientListQuery();
  const businessList = useBusinessListQuery();

  const {
    mutate: createInvoice,
    isError,
    error,
    isPending,
  } = useInvoiceCreateMutation();

  const { items, mutate, add, remove } = useCreateLineItemsState();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const formData = new FormData(event.currentTarget);

      createInvoice({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        business_id: Number(formData.get("business-id")),
        location: {
          address: formData.get("contact-address") as string,
          suburb: formData.get("contact-suburb") as string,
          city: formData.get("contact-city") as string,
        },
        line_items: items,
        due_date: new Date(formData.get("due_date") as string).toISOString(),
        client_id: Number(formData.get("client_id")),
      });
    },
    [items],
  );

  return (
    <>
      <section>
        <h2>Invoices</h2>
        <ul>
          {invoiceList?.data?.data?.map((invoice) => (
            <li key={invoice.invoice_id}>
              <Link to={invoice.invoice_id.toString()}>{invoice.name}</Link>
            </li>
          ))}
        </ul>
        {invoiceList.isSuccess && !invoiceList?.data?.data?.length && (
          <p>
            <em>No invoice found</em>
          </p>
        )}
      </section>
      <section>
        <h2>Create Invoice</h2>
        <form method="POST" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" required />
          </label>
          <br />
          <label>
            Description
            <textarea name="description" />
          </label>
          <br />
          <label>
            Business
            <select name="business-id" required>
              <option value="">Select Business</option>
              {businessList.isSuccess &&
                businessList?.data?.data?.map(({ business_id, name }) => (
                  <option key={business_id} value={business_id}>
                    {name}
                  </option>
                ))}
            </select>
          </label>
          <br />
          <fieldset>
            <legend>Location</legend>
            <label>
              Street
              <input type="text" name="contact-address" required />
            </label>
            <br />
            <label>
              Suburb
              <input type="text" name="contact-suburb" />
            </label>
            <br />
            <label>
              City
              <input type="text" name="contact-city" required />
            </label>
          </fieldset>
          <br />
          <label>
            Due Date
            <input type="date" name="due_date" required />
          </label>
          <br />
          <fieldset>
            <legend>Line Items</legend>
            <LineItems items={items} onChange={mutate} onRemove={remove} />
            {!items.length && <p>No Items</p>}
            <br />
            <fieldset>
              <legend>Add Line Item</legend>
              <CreateLineItemForm onCreateLineItem={add} />
            </fieldset>
          </fieldset>
          <br />
          <br />
          <label>
            Client
            <select name="client_id" required>
              <option value="">Select Client</option>
              {clientList.isSuccess &&
                clientList?.data?.data?.map(({ client_id, name }) => (
                  <option key={client_id} value={client_id}>
                    {name}
                  </option>
                ))}
            </select>
          </label>
          {isError && <p>{JSON.stringify(error)}</p>}
          <br />
          <button disabled={isPending} type="submit">
            Create
          </button>
        </form>
      </section>
    </>
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
            <LineItemForm
              name={item.name}
              description={item.description}
              quantity={item.quantity}
              customFields={item.custom_fields}
              onNameChange={(name) => handleChange(index, { ...item, name })}
              onQuantityChange={(quantity) =>
                handleChange(index, { ...item, quantity })
              }
              onCustomFieldsChange={(custom_fields) =>
                handleChange(index, { ...item, custom_fields })
              }
              onDescriptionChange={(description) =>
                handleChange(index, { ...item, description })
              }
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
  onCreateLineItem: handleCreateLineItem,
}: {
  onCreateLineItem: (item: CreateLineItem) => void;
}) {
  const [type, setType] = useState<"product" | "service">("product");
  const productListQuery = useProductListQuery(type === "product");
  const serviceListQuery = useServiceListQuery(type === "service");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [customFields, setCustomFields] = useState<LineItemCustomField[]>([]);
  const [detail, setDetail] = useState<
    CreateProductLineItem | CreateServiceLineItem
  >();

  const clear = () => {
    setName("");
    setDescription("");
    setQuantity(0);
    setCustomFields([]);
    setDetail(undefined);
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    invariant(name, "Detail must be set");
    handleCreateLineItem({
      key: uuid(),
      name,
      description,
      detail,
      custom_fields: customFields,
      quantity,
    });
    clear();
  };

  return (
    <>
      <LineItemForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        quantity={quantity}
        customFields={customFields}
        onQuantityChange={setQuantity}
        onCustomFieldsChange={setCustomFields}
      />
      <br />
      <fieldset>
        <legend>Service/Product</legend>
        <TypeDropdown type={type} onTypeChange={setType} />
        {type === "product" && (
          <ProductLineItemForm
            products={productListQuery.data?.data || []}
            selectedProductId={(detail as CreateProductLineItem)?.product_id}
            onProductIdChange={(product_id) => setDetail({ product_id })}
          />
        )}
        {type === "service" && (
          <ServiceLineItemForm
            services={serviceListQuery.data?.data || []}
            selectedServiceId={(detail as CreateServiceLineItem)?.service_id}
            onServiceIdChange={(service_id) => setDetail({ service_id })}
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
