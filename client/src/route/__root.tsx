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
        <Link to="/business">businesses</Link>
        <Link to="/">Home</Link>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    );
  },
});
