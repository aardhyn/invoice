import { Form } from "@radix-ui/react-form";
import { Flex, VStack } from "panda/jsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useClientListQuery, useClientCreateMutation } from "api";
import { Button, Card, Code, H2, H3, Section, Textarea, TextField } from "component";

export const Route = createLazyFileRoute("/business/$businessKey/client")({
  component: Page,
});

function Page() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);
  const { data: clientList, isSuccess } = useClientListQuery({ businessId });
  const { mutate: createClient, error, isPending } = useClientCreateMutation();

  return (
    <Section>
      <Card>
        <H2>Clients</H2>
        <ul>{clientList?.data?.map((client) => <li key={client.clientId}>{client.name}</li>)}</ul>
        {isSuccess && !clientList?.data?.length && (
          <p>
            <em>No clients found</em>
          </p>
        )}
      </Card>
      <Card>
        <H2>Create Client</H2>
        <Form
          method="POST"
          onSubmit={async (event) => {
            event?.preventDefault();
            const formData = new FormData(event.currentTarget);

            createClient({
              businessId,
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              contact: {
                name: formData.get("name") as string, // taken from name... but, (todo: do we need a client::name if we have client::contact::name)?
                cell: formData.get("cell") as string,
                email: formData.get("email") as string,
                location: {
                  address: formData.get("contact-address") as string,
                  suburb: formData.get("contact-suburb") as string,
                  city: formData.get("contact-city") as string,
                },
              },
            });
          }}
        >
          <VStack alignItems="start" gap="md">
            <TextField name="name" label="Name" required messages={[{ match: "valueMissing", message: "Name is required" }]} />
            <Textarea name="description" label="Description" />
            <H3>Contact</H3>
            <Flex gap="md" wrap="wrap">
              <TextField
                name="cell"
                label="Cellphone"
                type="tel"
                required
                messages={[{ match: "valueMissing", message: "Cellphone is required" }]}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                required
                messages={[
                  { match: "valueMissing", message: "Email is required" },
                  {
                    match: "typeMismatch",
                    message: "Please enter a valid email address",
                  },
                ]}
              />
            </Flex>
            <H3>Location</H3>
            <Flex gap="md" wrap="wrap">
              <TextField
                name="contact-address"
                label="Street"
                required
                messages={[
                  {
                    match: "valueMissing",
                    message: "Street address is required",
                  },
                ]}
              />
              <TextField name="contact-suburb" label="Suburb" />
              <TextField
                name="contact-city"
                label="City"
                required
                messages={[{ match: "valueMissing", message: "City is required" }]}
              />
            </Flex>
            {error && <Code language="json">{error}</Code>}
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </VStack>
        </Form>
      </Card>
    </Section>
  );
}
