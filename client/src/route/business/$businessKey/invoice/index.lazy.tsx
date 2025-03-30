import { FormEvent } from "react";
import { Form } from "@radix-ui/react-form";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Flex } from "panda/jsx";
import { Button, Card, Text, H2, H4, Section } from "component";
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

  const navigate = useNavigate();
  const toInvoice = (invoiceId: number) => ({
    to: "/business/$businessKey/invoice/$invoiceKey",
    params: { businessKey, invoiceKey: invoiceId.toString() },
  });

  const { mutate: duplicateInvoice } = useInvoiceDuplicateMutation();
  const handleCreateFromTemplate = (invoiceId: number) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    duplicateInvoice(
      { invoiceId },
      {
        onSuccess({ invoiceId }) {
          navigate(toInvoice(invoiceId));
        },
      },
    );
  };

  const invoiceCreateMutation = useInvoiceCreateMutation();
  const handleCreateFromScratch = () => {
    invoiceCreateMutation.mutate(
      { businessId },
      {
        onSuccess({ invoiceId }) {
          navigate(toInvoice(invoiceId));
        },
      },
    );
  };

  return (
    <Section>
      <Card>
        <Flex justify="space-between" gap="sm">
          <H2>Invoices</H2>
          <Button onClick={handleCreateFromScratch}>New</Button>
        </Flex>
        <ul>
          {invoiceList?.data?.data?.map((invoice) => (
            <li key={invoice.invoiceId}>
              <Link to={invoice.invoiceId.toString()}>
                <Text>{invoice.name || "Untitled Invoice"}</Text>
              </Link>
            </li>
          ))}
          {invoiceList.isSuccess && !invoiceList?.data?.data?.length && (
            <li>
              <Text color="2">No invoice found</Text>
            </li>
          )}
        </ul>
      </Card>
      <Card>
        <H2>Templates</H2>
        <ul>
          {invoiceTemplates?.map(({ invoiceId, name, description, location, clientName }) => (
            <li key={invoiceId}>
              <Form onSubmit={handleCreateFromTemplate(invoiceId)}>
                <Card>
                  <Flex align="center" justify="space-between">
                    <H4>{name}</H4>
                    <Button>Create</Button>
                  </Flex>
                  <Text>{description}</Text>
                  {clientName && <Text>Client: {clientName}</Text>}
                  {location && <Text>{locationStringify(location)}</Text>}
                </Card>
              </Form>
            </li>
          ))}
          {!invoiceTemplates?.length && (
            <li>
              <Text color="2">No templates</Text>
            </li>
          )}
        </ul>
      </Card>
    </Section>
  );
}
