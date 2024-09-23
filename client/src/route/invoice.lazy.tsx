import { Link, createLazyFileRoute } from "@tanstack/react-router";
import {
  useInvoiceListQuery,
  useClientListQuery,
  useBusinessListQuery,
  useCreateInvoiceMutation,
  LineItem,
} from "api";
import { MouseEvent } from "react";
import { FormEvent, useCallback, useState } from "react";
import { uuid } from "common";

export const Route = createLazyFileRoute("/invoice")({
  component: Page,
});

function useLineItems() {
  const [items, setItems] = useState<LineItem[]>([]);
  const add = (item: LineItem) => {
    setItems([...items, item]);
  };
  const remove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const mutate = (index: number, mutation: Partial<Omit<LineItem, "key">>) => {
    const next = items.map((item, i) => {
      return i === index ? { ...item, ...mutation } : item;
    });
    setItems(next);
  };
  return { items, add, mutate, remove };
}

function Page() {
  const invoiceList = useInvoiceListQuery();
  const clientList = useClientListQuery();
  const businessList = useBusinessListQuery();

  const {
    mutate: createInvoice,
    isError,
    error,
    isPending,
  } = useCreateInvoiceMutation();

  const { items, mutate, add, remove } = useLineItems();

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
            <NewLineItem onCreateLineItem={add} />
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
  onChange: (index: number, item: LineItem) => void;
  onRemove: (index: number) => void;
  items: LineItem[];
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
              onNameChange={(name) => handleChange(index, { ...item, name })}
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

function LineItemForm({
  name = "",
  description = "",
  onNameChange,
  onDescriptionChange,
}: {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}) {
  const handleNameChange = (e: FormEvent<HTMLInputElement>) => {
    onNameChange(e.currentTarget.value);
  };
  const handleDescriptionChange = (e: FormEvent<HTMLInputElement>) => {
    onDescriptionChange(e.currentTarget.value);
  };

  return (
    <>
      <input type="text" value={name} onChange={handleNameChange} />
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
      />
    </>
  );
}

function NewLineItem({
  onCreateLineItem: handleCreateLineItem,
}: {
  onCreateLineItem: (item: LineItem) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const clear = () => {
    setName("");
    setDescription("");
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleCreateLineItem({ key: uuid(), name, description, detail: {} });
    clear();
  };

  return (
    <>
      <LineItemForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
      />
      <button type="button" onClick={handleClick}>
        Add
      </button>
    </>
  );
}
