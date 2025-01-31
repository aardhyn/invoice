import { createLazyFileRoute } from "@tanstack/react-router";
import { useProductCreateMutation, useProductListQuery } from "api";

export const Route = createLazyFileRoute("/business/$businessKey/product")({
  component: Page,
});

function Page() {
  return (
    <div>
      <h2>Products</h2>
      <ProductList />
      <h2>Create Product</h2>
      <CreateProductForm />
    </div>
  );
}

function ProductList() {
  const { businessKey } = Route.useParams();
  const {
    data: productList,
    error,
    isLoading,
  } = useProductListQuery({ business_id: parseInt(businessKey) });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {productList?.data?.map((product) => (
        <li key={product.product_id}>{product.name}</li>
      ))}
      {productList?.data?.length === 0 && <li>No products found</li>}
    </ul>
  );
}

function CreateProductForm() {
  const {
    mutate: createService,
    error,
    isPending,
  } = useProductCreateMutation();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createService({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" required />
      </label>
      <br />
      <label>
        Description
        <input name="description" required />
      </label>
      <br />
      <label>
        Price
        <input name="rate" type="number" required />
      </label>
      <br />
      {isPending && <div>Creating...</div>}
      {error && <div>Error: {error.message}</div>}
      <button type="submit" disabled={isPending}>
        Create Product
      </button>
    </form>
  );
}
