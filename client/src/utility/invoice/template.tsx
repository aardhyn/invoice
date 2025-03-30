import { useMemo } from "react";
import { useInvoiceTemplateCreateMutation, useInvoiceTemplateDeleteMutation, useInvoiceTemplateListQuery } from "api";
import { invariant } from "common";

export function useInvoiceTemplateState({ invoiceKey, businessKey }: { invoiceKey: string; businessKey: string }) {
  const businessId = parseInt(businessKey);

  const { data: invoiceTemplates } = useInvoiceTemplateListQuery({
    businessId,
  });

  const createTemplateMutation = useInvoiceTemplateCreateMutation();
  const deleteTemplateMutation = useInvoiceTemplateDeleteMutation();
  const isPending = createTemplateMutation.isPending || deleteTemplateMutation.isPending;

  const [isTemplate, toggleTemplate] = useMemo(() => {
    const invoiceId = parseInt(invoiceKey);
    invariant(typeof invoiceId === "number" && !Number.isNaN(invoiceId), "invoiceKey is required to toggle template");
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
