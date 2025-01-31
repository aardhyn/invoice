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
      </ul>
      <Outlet />
      <NoPrint>
        <TanStackRouterDevtools />
      </NoPrint>
    </main>
  );
}
