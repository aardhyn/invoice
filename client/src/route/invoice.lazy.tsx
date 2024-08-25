import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useInvoiceListQuery,
  useClientListQuery,
  useBusinessListQuery,
  useCreateInvoiceMutation,
} from "api";

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
  } = useCreateInvoiceMutation();

  return (
    <>
      <section>
        <h2>Invoices</h2>
        <ul>
          {invoiceList?.data?.data?.map((invoice) => (
            <li key={invoice.invoice_id}>{invoice.name}</li>
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
        <form
          method="POST"
          onSubmit={async (event) => {
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
              due_date: new Date(
                formData.get("due_date") as string,
              ).toISOString(),
              payment_id: Number(formData.get("payment_id")),
              client_id: Number(formData.get("client_id")),
            });
          }}
        >
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
