import { createLazyFileRoute } from "@tanstack/react-router";
import { useInvoiceGetQuery } from "api";
import { InvoicePreview, Print } from "component";

import templateStyles from "component/template/style.css?inline";

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

  if (error || !invoice?.data) {
    return <div>Failed to load invoice: {error?.message || "no data"}</div>;
  }

  return (
    <div>
      <h2>{invoice.data?.name}</h2>
      <h3>raw data</h3>

      <details>
        <summary>Raw data</summary>
        <pre>{JSON.stringify(invoice, null, 2)}</pre>
      </details>

      <details>
        <summary>Print preview</summary>
        <InvoicePreview invoice={invoice.data} />
      </details>

      <Print
        style={templateStyles}
        content={<InvoicePreview invoice={invoice.data} />}
      >
        <button>Print</button>
      </Print>
    </div>
  );
}
