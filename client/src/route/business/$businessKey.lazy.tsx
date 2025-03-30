import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { styled } from "panda/jsx";
import { NotFound, BusinessSidebar } from "component";

export const Route = createLazyFileRoute("/business/$businessKey")({
  component: Page,
  notFoundComponent: NotFound,
});

function Page() {
  const params = Route.useParams();
  return (
    <Root>
      <BusinessSidebar businessKey={params.businessKey} />
      <Outlet />
    </Root>
  );
}

const Root = styled("div", {
  base: {
    h: "100%",
    w: "100%",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
  },
});
