import { FormEvent } from "react";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  locationStringify,
  useInvoiceListQuery,
  useInvoiceTemplateListQuery,
  useInvoiceDuplicateMutation,
  useInvoiceCreateMutation,
} from "api";

export const Route = createLazyFileRoute("/business/$businessKey/invoice/")({
  component: Page,
});

function Page() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const invoiceList = useInvoiceListQuery({ businessId });

  const { data: invoiceTemplates } = useInvoiceTemplateListQuery({
    businessId,
  });
  const { mutate: duplicateInvoice } = useInvoiceDuplicateMutation();
  const handleCreateFromTemplate =
    (invoiceId: number) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      duplicateInvoice({ invoiceId });
    };

  const navigate = useNavigate();
  const invoiceCreateMutation = useInvoiceCreateMutation();
  const handleCreateFromScratch = () => {
    invoiceCreateMutation.mutate(
      { businessId },
      {
        onSuccess({ invoiceId }) {
          const invoiceKey = invoiceId.toString();
          navigate({
            to: "/business/$businessKey/invoice/$invoiceKey",
            params: { businessKey, invoiceKey },
          });
        },
      },
    );
  };

  return (
    <>
      <section>
        <h2>Invoices</h2>
        <ul>
          {invoiceList?.data?.data?.map((invoice) => (
            <li key={invoice.invoiceId}>
              <Link to={invoice.invoiceId.toString()}>
                {invoice.name || "Untitled Invoice"}
              </Link>
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
        <h3>Create Invoice</h3>
        <fieldset>
          <legend>From Template</legend>
          <ul>
            {invoiceTemplates?.map(
              ({ invoiceId, name, description, location, clientName }) => (
                <li key={invoiceId}>
                  <form onSubmit={handleCreateFromTemplate(invoiceId)}>
                    <button style={{ textAlign: "left" }}>
                      <h4>{name}</h4>
                      <p>{description}</p>
                      <p>Client: {clientName}</p>
                      <p>Address: {locationStringify(location)}</p>
                    </button>
                  </form>
                </li>
              ),
            )}
          </ul>
        </fieldset>
        <fieldset>
          <legend>From Scratch</legend>
          <button onClick={handleCreateFromScratch}>Create</button>
        </fieldset>
      </section>
    </>
  );
}
