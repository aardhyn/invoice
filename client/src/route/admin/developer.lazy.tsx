import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useSystemSeedMutation } from "api";
import { Section, Button, H2, Text, Card, Code } from "component";

export const Route = createLazyFileRoute("/admin/developer")({
  component: Page,
});

function Page() {
  const seedMutation = useSystemSeedMutation();

  const [response, setResponse] = useState<{ thing: false } | Error | undefined>();

  const handleSeed = () => {
    seedMutation.mutate(undefined, {
      onError: setResponse,
      onSuccess: setResponse,
    });
  };

  return (
    <Section>
      <Card>
        <H2>Developer</H2>
        <Text>Seed the database with some data</Text>
        <Button onClick={handleSeed}>Seed</Button>
        {response && <Code language="json">{response}</Code>}
      </Card>
    </Section>
  );
}
