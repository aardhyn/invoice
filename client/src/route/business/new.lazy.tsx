import type { SyntheticEvent } from "react";
import { Form } from "@radix-ui/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Flex, VStack } from "panda/jsx";
import { Button, Card, Code, H2, H3, Section, Text, Textarea, TextField } from "component";
import { useBusinessCreateMutation } from "api";

export const Route = createLazyFileRoute("/business/new")({
  component: Page,
});

function Page() {
  const { mutate: createBusiness, error, isPending } = useBusinessCreateMutation();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const formData = new FormData(event.currentTarget);
    createBusiness({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: {
        address: formData.get("address") as string,
        suburb: formData.get("suburb") as string,
        city: formData.get("city") as string,
      },
      contact: {
        name: formData.get("contact-name") as string,
        cell: formData.get("cell") as string,
        email: formData.get("email") as string,
        location: {
          address: formData.get("contact-address") as string,
          suburb: formData.get("contact-suburb") as string,
          city: formData.get("contact-city") as string,
        },
      },
      accountNumber: formData.get("account-number") as string,
      accountName: formData.get("account-name") as string,
    });
  };

  return (
    <Section>
      <Card>
        <H2>Create Business</H2>
        <Form onSubmit={handleSubmit}>
          <VStack gap="md" alignItems="flex-start">
            <TextField label="Name" name="name" required messages={[{ match: "valueMissing", message: "Name is required" }]} />
            <Textarea label="Description" name="description" />

            <H3>Location</H3>
            <Text>Details for the businesses physical address (if there is one), displayed on invoices.</Text>
            <Flex gap="md">
              <TextField label="Address" name="address" />
              <TextField label="Suburb" name="suburb" />
              <TextField label="City" name="city" />
            </Flex>

            <H3>Owner</H3>
            <Text>Details of the business owner and displayed on invoices.</Text>
            <Flex gap="md">
              <TextField
                label="Owner"
                name="contact-name"
                required
                messages={[
                  {
                    match: "valueMissing",
                    message: "Contact name is required",
                  },
                ]}
              />
              <TextField label="Phone" name="cell" type="tel" />
              <TextField
                label="Email"
                name="email"
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
            <Flex gap="md">
              <TextField
                label="Street"
                name="contact-address"
                required
                messages={[
                  {
                    match: "valueMissing",
                    message: "Street address is required",
                  },
                ]}
              />
              <TextField label="Suburb" name="contact-suburb" />
              <TextField
                label="City"
                name="contact-city"
                required
                messages={[{ match: "valueMissing", message: "City is required" }]}
              />
            </Flex>

            <H3>Bank</H3>
            <Text>Details of the bank account where payments will be made to, displayed on invoices.</Text>
            <Flex gap="md">
              <TextField
                label="Account Name"
                name="account-name"
                required
                messages={[
                  {
                    match: "valueMissing",
                    message: "Account name is required",
                  },
                ]}
              />
              <TextField
                label="Account Number"
                name="account-number"
                required
                messages={[
                  {
                    match: "valueMissing",
                    message: "Account number is required",
                  },
                ]}
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
