import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useInvoiceGetQuery,
  useInvoiceTemplateCreateMutation,
  useInvoiceTemplateListQuery,
  useInvoiceTemplateDeleteMutation,
} from "api";
import { invariant } from "common";
import { DraftInvoiceMutationForm, InvoicePreview, Print } from "component";
import { useMemo } from "react";

import templateStyles from "component/template/invoice/style.css?inline";

export const Route = createLazyFileRoute(
  "/business/$businessKey/invoice/$invoiceKey",
)({
  component: Page,
});

function Page() {
  const { invoiceKey } = Route.useParams();
  const invoiceId = parseInt(invoiceKey);
  const { data: invoice, error, isLoading } = useInvoiceGetQuery({ invoiceId });

  const [isTemplate, toggleTemplate] = useInvoiceTemplateState();
  const toggleTemplateText = isTemplate
    ? "Remove from Templates"
    : "Save as Template";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invoice || error) {
    return <div>Failed to load invoice: {error?.message || "no data"}</div>;
  }

  return (
    <>
      <h2>{invoice.name}</h2>

      <button onClick={toggleTemplate}>{toggleTemplateText}</button>

      <section>
        <h3>Edit Invoice</h3>
        <DraftInvoiceMutationForm initialInvoice={invoice} />
      </section>

      <section>
        <h3>Preview</h3>
        <details>
          <summary>Show</summary>
          <InvoicePreview invoice={invoice} />
        </details>
      </section>
      <Print
        style={templateStyles}
        content={<InvoicePreview invoice={invoice} />}
      >
        <button>Print</button>
      </Print>
    </>
  );
}

function useInvoiceTemplateState() {
  const { invoiceKey, businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const { data: invoiceTemplates } = useInvoiceTemplateListQuery({
    businessId,
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
      invoiceTemplates?.some((template) => template.invoiceId === invoiceId),
      () => {
        invariant(!isPending, "cannot toggle template while pending");
        if (isTemplate) {
          deleteTemplateMutation.mutate({ invoiceId });
        } else {
          createTemplateMutation.mutate({ invoiceId });
        }
      },
    ];
  }, [invoiceKey, isPending, invoiceTemplates]);

  return [isTemplate, toggleTemplate] as const;
}
