import { createLazyFileRoute } from "@tanstack/react-router";
import { useBusinessGetQuery } from "api/business/get";

export const Route = createLazyFileRoute("/business/$businessKey/")({
  component: Page,
});

function Page() {
  const { businessKey } = Route.useParams();
  const business_id = parseInt(businessKey);

  const { data: business } = useBusinessGetQuery({ business_id });

  return (
    <div>
      <h2>{business?.data?.name}</h2>
    </div>
  );
}
