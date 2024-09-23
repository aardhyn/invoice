import { createLazyFileRoute } from "@tanstack/react-router";
import { useInvoiceGetQuery } from "api";

export const Route = createLazyFileRoute("/invoice/$invoiceKey")({
  component: Page,
});

function Page() {
  const { invoiceKey } = Route.useParams();
  const {
    data: invoice,
    error,
    isLoading,
  } = useInvoiceGetQuery(parseInt(invoiceKey));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !invoice) {
    return <div>Failed to load invoice: {error?.message || "no data"}</div>;
  }

  return (
    <div>
      <h2>{invoice.data?.name}</h2>
      <pre>{JSON.stringify(invoice.data, null, 2)}</pre>
    </div>
  );
}
