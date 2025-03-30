import { createLazyFileRoute } from "@tanstack/react-router";
import { Form } from "@radix-ui/react-form";
import { Flex, VStack } from "panda/jsx";
import { useServiceCreateMutation, useServiceListQuery } from "api";
import { Button, Card, Code, H2, H3, Section, Textarea, TextField } from "component";

export const Route = createLazyFileRoute("/business/$businessKey/service")({
  component: Page,
});

function Page() {
  return (
    <Section>
      <Card>
        <H2>Services</H2>
        <ServiceList />
      </Card>
      <Card>
        <H2>Create Service</H2>
        <CreateServiceForm />
      </Card>
    </Section>
  );
}

function ServiceList() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);
  const { data: serviceList, error, isLoading } = useServiceListQuery({ businessId: businessId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {serviceList?.data?.map((service) => <li key={service.serviceId}>{service.name}</li>)}
      {serviceList?.data?.length === 0 && <li>No services found</li>}
    </ul>
  );
}

function CreateServiceForm() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const { mutate: createService, error, isPending } = useServiceCreateMutation();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createService({
      businessId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      initialRate: Number(formData.get("initialRate")),
      initialRateThreshold: Number(formData.get("initialRateThreshold")),
      rate: Number(formData.get("rate")),
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <VStack alignItems="start" gap="md">
        <TextField name="name" label="Name" required messages={[{ match: "valueMissing", message: "Name is required" }]} />
        <Textarea name="description" label="Description" />
        <H3>Rate</H3>
        <TextField
          name="rate"
          label="Rate"
          type="number"
          required
          messages={[{ match: "valueMissing", message: "Rate is required" }]}
        />
        <Flex gap="md">
          <TextField
            name="initialRate"
            label="Initial"
            type="number"
            messages={[
              {
                match: (value, formData) => !value && !!formData.get("initialRateThreshold"),
                message: "Provide an initial rate before the threshold",
              },
              {
                match: "rangeUnderflow",
                message: "Unit cost cannot be negative",
              },
              {
                match: "stepMismatch",
                message: "Unit cost must be 2 decimal places",
              },
            ]}
          />
          <TextField
            name="initialRateThreshold"
            label="Threshold"
            type="number"
            step={1}
            messages={[
              {
                match: (value, formData) => !value && !!formData.get("initialRate"),
                message: "A threshold is required when an initial rate is set",
              },
              {
                match: "rangeUnderflow",
                message: "Initial Rate Threshold cannot be less than 0",
              },
              {
                match: "stepMismatch",
                message: "Initial Rate Threshold must be a whole number",
              },
            ]}
            css={{ width: 64 }}
          />
        </Flex>
        {error && <Code>{error.message}</Code>}
        <Button type="submit" disabled={isPending}>
          Create Service
        </Button>
      </VStack>
    </Form>
  );
}
