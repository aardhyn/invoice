import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useBusinessGetQuery } from "api/business/get";

export const Route = createFileRoute("/business/$businessKey")({
  component: Page,
});

function Page() {
  const params = Route.useParams();
  const business_id = parseInt(params.businessKey);

  const { data: business } = useBusinessGetQuery({ business_id });

  return (
    <ul>
      <h2>{business?.data?.name}</h2>
      <li>
        <Link to={`/business/$businessKey/client`} params={params}>
          Clients
        </Link>
      </li>
      <li>
        <Link to={`/business/$businessKey/service`} params={params}>
          Services
        </Link>
      </li>
      <li>
        <Link to={`/business/$businessKey/product`} params={params}>
          Products
        </Link>
      </li>
      <li>
        <Link to={`/business/$businessKey/invoice`} params={params}>
          Invoices
        </Link>
      </li>
      <Outlet />
    </ul>
  );
}
