import { Form } from "@radix-ui/react-form";
import { VStack } from "panda/jsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useProductCreateMutation, useProductListQuery } from "api";
import { Button, Card, Code, H2, Section, Text, Textarea, TextField } from "component";

export const Route = createLazyFileRoute("/business/$businessKey/product")({
  component: Page,
});

function Page() {
  return (
    <Section>
      <Card>
        <H2>Products</H2>
        <ProductList />
      </Card>
      <Card>
        <H2>Create Product</H2>
        <CreateProductForm />
      </Card>
    </Section>
  );
}

function ProductList() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);
  const { data: productList, error, isLoading } = useProductListQuery({ businessId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {productList?.map((product) => (
        <li key={product.productId}>
          <Text>{product.name}</Text>
        </li>
      ))}
      {productList?.length === 0 && <li>No products found</li>}
    </ul>
  );
}

function CreateProductForm() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const { mutate: createService, error, isPending } = useProductCreateMutation();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createService({
      businessId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      unitCost: Number(formData.get("unit-cost")),
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <VStack gap="md" alignItems="start">
        <TextField name="name" label="Name" required messages={[{ match: "valueMissing", message: "Name is required" }]} />
        <Textarea name="description" label="Description" />
        <TextField
          name="unit-cost"
          label="Unit cost"
          type="number"
          min={0}
          step="0.01"
          required
          messages={[
            { match: "valueMissing", message: "Unit cost is required" },
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
        {isPending && <div>Creating...</div>}
        {error && <Code language="json">{error}</Code>}
        <Button type="submit" disabled={isPending}>
          Create Product
        </Button>
      </VStack>
    </Form>
  );
}
