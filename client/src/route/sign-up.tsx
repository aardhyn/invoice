import { createFileRoute } from "@tanstack/react-router";
import { H1, Section } from "component";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Section>
      <H1>Sign Up</H1>
    </Section>
  );
}
