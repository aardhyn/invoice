import {
  createRootRoute,
  Link,
  Outlet,
  RootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route: RootRoute = createRootRoute({
  component() {
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
            <Link to="/invoice">Invoices</Link>
          </li>
        </ul>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    );
  },
});
