import { createLazyFileRoute } from "@tanstack/react-router";
import { useBusinessGetQuery } from "api/business/get";
import { Json } from "component";

export const Route = createLazyFileRoute("/business/$businessKey/")({
  component: Page,
});

function Page() {
  const { businessKey } = Route.useParams();
  const businessId = parseInt(businessKey);

  const { data: business } = useBusinessGetQuery({ businessId });

  return (
    <div>
      <Json>{business}</Json>
    </div>
  );
}
