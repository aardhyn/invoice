import { FormEvent } from "react";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, H2, H4, Section, Text } from "component";
import {
  locationStringify,
  useInvoiceListQuery,
  useInvoiceTemplateListQuery,
  useInvoiceDuplicateMutation,
  useInvoiceCreateMutation,
} from "api";
import { Flex } from "panda/jsx";
import { Form } from "@radix-ui/react-form";

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
  const handleCreateFromTemplate = (invoiceId: number) => (event: FormEvent<HTMLFormElement>) => {
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
    <Section>
      <Card>
        <Flex justify="space-between" gap="sm">
          <H2>Invoices</H2>
          <Button onClick={handleCreateFromScratch}>New</Button>
        </Flex>
        <ul>
          {invoiceList?.data?.data?.map((invoice) => (
            <li key={invoice.invoiceId}>
              <Link to={invoice.invoiceId.toString()}>{invoice.name || "Untitled Invoice"}</Link>
            </li>
          ))}
        </ul>
        {invoiceList.isSuccess && !invoiceList?.data?.data?.length && (
          <p>
            <em>No invoice found</em>
          </p>
        )}
      </Card>
      <Card>
        <H2>Templates</H2>
        <ul>
          {invoiceTemplates?.map(({ invoiceId, name, description, location, clientName }) => (
            <li key={invoiceId}>
              <Form onSubmit={handleCreateFromTemplate(invoiceId)}>
                <Button style={{ textAlign: "left" }}>
                  <H4>{name}</H4>
                  <Text>{description}</Text>
                  {clientName && <Text>Client: {clientName}</Text>}
                  {location && <Text> Address: {locationStringify(location)}</Text>}
                </Button>
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
