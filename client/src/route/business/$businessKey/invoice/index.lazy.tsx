import { FormEvent } from "react";
import {
  locationStringify,
  useInvoiceListQuery,
  useInvoiceTemplateListQuery,
  useInvoiceDuplicateMutation,
  useInvoiceCreateMutation,
} from "api";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/business/$businessKey/invoice/")({
  component: Page,
});

function Page() {
  const { businessKey } = Route.useParams();
  const business_id = parseInt(businessKey);

  const invoiceList = useInvoiceListQuery({ business_id });

  const { data: invoiceTemplates } = useInvoiceTemplateListQuery({
    business_id,
  });
  const { mutate: duplicateInvoice } = useInvoiceDuplicateMutation();
  const handleCreateFromTemplate =
    (invoiceId: number) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      duplicateInvoice({ invoice_id: invoiceId });
    };

  const navigate = useNavigate();
  const invoiceCreateMutation = useInvoiceCreateMutation();
  const handleCreateFromScratch = () => {
    invoiceCreateMutation.mutate(
      { business_id },
      {
        onSuccess({ invoice_id }) {
          const invoiceKey = invoice_id.toString();
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
        <h3>Create Invoice</h3>
        <fieldset>
          <legend>From Template</legend>
          <ul>
            {invoiceTemplates?.data?.map(
              ({ invoice_id, name, description, location, client_name }) => (
                <li key={invoice_id}>
                  <form onSubmit={handleCreateFromTemplate(invoice_id)}>
                    <button style={{ textAlign: "left" }}>
                      <h4>{name}</h4>
                      <p>{description}</p>
                      <p>Client: {client_name}</p>
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
