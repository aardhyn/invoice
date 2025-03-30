import { createLazyFileRoute } from "@tanstack/react-router";
import { useBusinessGetQuery } from "api";
import { Card, Code, H2, Section } from "component";

export const Route = createLazyFileRoute("/business/$businessKey/")({
  component: Page,
});

function Page() {
  const params = Route.useParams();
  const businessId = parseInt(params.businessKey);

  const { data: business } = useBusinessGetQuery({ businessId });

  return (
    <Section>
      <Card>
        <H2>Dashboard</H2>
        <Code language="json">{params}</Code>
        <Code language="json">{business}</Code>
      </Card>
    </Section>
  );
}
