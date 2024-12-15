import {
  createRootRoute,
  Link,
  Outlet,
  RootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NoPrint } from "component/utility/NoPrint";

export const Route: RootRoute = createRootRoute({
  component: Page,
});

function Page() {
  return (
    <main>
      <h1>Invoice</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/business">Businesses</Link>
        </li>
        <li>
          <Link to="/client">Clients</Link>
        </li>
        <li>
          <Link to="/service">Services</Link>
        </li>
        <li>
          <Link to="/product">Products</Link>
        </li>
        <li>
          <Link to="/invoice">Invoices</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
      <Outlet />
      <NoPrint>
        <TanStackRouterDevtools />
      </NoPrint>
    </main>
  );
}
