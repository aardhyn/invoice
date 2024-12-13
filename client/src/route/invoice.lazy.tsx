import { Link, createLazyFileRoute } from "@tanstack/react-router";
import {
  useInvoiceListQuery,
  useClientListQuery,
  useBusinessListQuery,
  useInvoiceCreateMutation,
  CreateInvoice,
  CreateLineItem,
  useProductListQuery,
  useServiceListQuery,
} from "api";
import { MouseEvent, FormEvent, useCallback, useState } from "react";
import { invariant, uuid } from "common";
import { useLineItemsState as useCreateLineItemsState } from "component/invoice/line_item/useLineItems";
import {
  LineItemForm,
  ProductLineItemForm,
  ServiceLineItemForm,
} from "component/invoice";
import {
  CreateProductLineItem,
  CreateServiceLineItem,
  LineItemCustomField,
} from "../api/utility/line_item";

export const Route = createLazyFileRoute("/invoice")({
  component: Page,
});

const DEFAULT_VALUES: CreateInvoice = {
  name: "Test INvoice",
  description: "Testing the invoice creation flow",
  business_id: 0,
  client_id: 0,
  due_date: "",
  location: {
    address: "817",
    suburb: "",
    city: "",
  },
  line_items: [
    {
      key: uuid(),
      name: "Interesting Product",
      description: "Testing the line item creation flow",
      detail: {
        product_id: 0,
      },
      custom_fields: [
        {
          key: uuid(),
          name: "Has interesting data",
          type: "boolean",
          data: true,
        },
      ],
      quantity: 1,
    },
    {
      key: uuid(),
      name: "Test Service Line Item",
      description: "Testing the line item creation flow",
      detail: {
        service_id: 0,
      },
      custom_fields: [],
      quantity: 1,
    },
  ],
};

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
          <label>
            Due Date
            <input type="date" name="due_date" required />
          </label>
          <br />
          <label>
            <h3>line items</h3>
            <LineItems items={items} onChange={mutate} onRemove={remove} />
            <h4>Add</h4>
            <CreateLineItemForm onCreateLineItem={add} />
            <br />
          </label>
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
  // FIXME: products and services should be in a combined dropdown, and selection determines the type.
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
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    invariant(name, "Detail must be set");
    invariant(detail, "Detail must be set");
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
      {type === "product" && (
        <ProductLineItemForm
          products={productListQuery.data?.data || []}
          onProductIdChange={(product_id) => setDetail({ product_id })}
        />
      )}
      {type === "service" && (
        <ServiceLineItemForm
          services={serviceListQuery.data?.data || []}
          onServiceIdChange={(service_id) => setDetail({ service_id })}
        />
      )}
      <button type="button" onClick={handleClick}>
        Add
      </button>
    </>
  );
}
