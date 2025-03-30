import { createFileRoute } from "@tanstack/react-router";
import { H1, Section } from "component";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Section>
      <H1>Sign In</H1>
    </Section>
  );
}
