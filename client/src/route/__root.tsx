import { createRootRoute, Outlet, RootRoute } from "@tanstack/react-router";
import { NotFound, Ribbon } from "component";
import { styled } from "panda/jsx";

export const Route: RootRoute = createRootRoute({
  component: Page,
  notFoundComponent: NotFound,
});

function Page() {
  return (
    <Root>
      <Ribbon />
      <Outlet />
    </Root>
  );
}
const Root = styled("div", {
  base: {
    h: "100vh",
    w: "100vw",
    d: "grid",
    gridTemplateRows: "auto 1fr",
    overflow: "hidden",
  },
});
