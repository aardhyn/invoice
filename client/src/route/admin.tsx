import { createFileRoute, Outlet } from "@tanstack/react-router";
import { styled } from "panda/jsx";
import { NotFound, AdminSidebar } from "component";

export const Route = createFileRoute("/admin")({
  component: Page,
  notFoundComponent: NotFound,
});

function Page() {
  return (
    <Root>
      <AdminSidebar />
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
