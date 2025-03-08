import { createLazyFileRoute } from "@tanstack/react-router";
import { useServiceCreateMutation, useServiceListQuery } from "api";
import { useState } from "react";

export const Route = createLazyFileRoute("/business/$businessKey/service")({
  component: Page,
});

function Page() {
  return (
    <div>
      <h2>Services</h2>
      <ServiceList />
      <h2>Create Service</h2>
      <CreateServiceForm />
    </div>
  );
}

function ServiceList() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);
  const {
    data: serviceList,
    error,
    isLoading,
  } = useServiceListQuery({ businessId: businessId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {serviceList?.data?.map((service) => (
        <li key={service.serviceId}>{service.name}</li>
      ))}
      {serviceList?.data?.length === 0 && <li>No services found</li>}
    </ul>
  );
}

function CreateServiceForm() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const {
    mutate: createService,
    error,
    isPending,
  } = useServiceCreateMutation();

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

  const [initialRate, setInitialRate] = useState<number>();
  const [initialRateThreshold, setInitialRateThreshold] = useState<number>();

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
        Initial Rate
        <input
          name="initialRate"
          type="number"
          value={initialRate ?? ""}
          onChange={(event) => setInitialRate(Number(event.target.value))}
          required={typeof initialRateThreshold === "number"}
        />
        <button type="button" onClick={() => setInitialRate(undefined)}>
          Clear
        </button>
      </label>
      <br />
      <label>
        Initial Rate Threshold
        <input
          name="initialRateThreshold"
          type="number"
          value={initialRateThreshold ?? ""}
          onChange={(event) =>
            setInitialRateThreshold(Number(event.target.value))
          }
          required={typeof initialRate === "number"}
        />
        <button
          type="button"
          onClick={() => setInitialRateThreshold(undefined)}
        >
          Clear
        </button>
      </label>
      <br />
      <label>
        Rate
        <input name="rate" type="number" required />
      </label>
      <br />
      {isPending && <div>Creating...</div>}
      {error && <div>Error: {error.message}</div>}
      <button type="submit" disabled={isPending}>
        Create Service
      </button>
    </form>
  );
}
