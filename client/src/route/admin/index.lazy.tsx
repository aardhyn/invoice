import { createLazyFileRoute } from "@tanstack/react-router";
import { Card, H2, Section, Text } from "component";

export const Route = createLazyFileRoute("/admin/")({
  component: Page,
});

function Page() {
  return (
    <Section>
      <Card>
        <H2>Admin</H2>
        <Text>Functions and analytics for admins and developers</Text>
      </Card>
    </Section>
  );
}
