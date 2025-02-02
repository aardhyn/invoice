import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useInvoiceGetQuery,
  useInvoiceTemplateCreateMutation,
  useInvoiceTemplateListQuery,
  useInvoiceTemplateDeleteMutation,
} from "api";
import { invariant } from "common";
import { InvoicePreview, Print } from "component";
import { useMemo } from "react";

import templateStyles from "component/template/invoice/style.css?inline";

export const Route = createLazyFileRoute(
  "/business/$businessKey/invoice/$invoiceKey",
)({
  component: Page,
});

function Page() {
  const { invoiceKey } = Route.useParams();
  const invoice_id = parseInt(invoiceKey);
  const {
    data: invoice,
    error,
    isLoading,
  } = useInvoiceGetQuery({ invoice_id });

  const [isTemplate, toggleTemplate] = useInvoiceTemplateState();
  const toggleTemplateText = isTemplate
    ? "Remove from Templates"
    : "Save as Template";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !invoice?.data) {
    return <div>Failed to load invoice: {error?.message || "no data"}</div>;
  }

  return (
    <div>
      <h2>{invoice.data?.name}</h2>

      <button onClick={toggleTemplate}>{toggleTemplateText}</button>

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

function useInvoiceTemplateState() {
  const { invoiceKey, businessKey } = Route.useParams();
  const business_id = parseInt(businessKey);

  const { data: invoiceTemplates } = useInvoiceTemplateListQuery({
    business_id,
  });

  const createTemplateMutation = useInvoiceTemplateCreateMutation();
  const deleteTemplateMutation = useInvoiceTemplateDeleteMutation();
  const isPending =
    createTemplateMutation.isPending || deleteTemplateMutation.isPending;

  const [isTemplate, toggleTemplate] = useMemo(() => {
    const invoiceId = parseInt(invoiceKey);
    invariant(
      typeof invoiceId === "number" && !Number.isNaN(invoiceId),
      "invoiceKey is required to toggle template",
    );
    return [
      invoiceTemplates?.data?.some(
        (template) => template.invoice_id === invoiceId,
      ),
      () => {
        invariant(!isPending, "cannot toggle template while pending");
        if (isTemplate) {
          deleteTemplateMutation.mutate({ invoice_id: invoiceId });
        } else {
          createTemplateMutation.mutate({ invoice_id: invoiceId });
        }
      },
    ];
  }, [invoiceKey, isPending, invoiceTemplates?.data]);

  return [isTemplate, toggleTemplate] as const;
}
