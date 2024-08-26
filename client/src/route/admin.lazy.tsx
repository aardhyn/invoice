import { createLazyFileRoute } from "@tanstack/react-router";
import { useSystemSeedMutation } from "api";

export const Route = createLazyFileRoute("/admin")({
  component: Page,
});

function Page() {
  const seedMutation = useSystemSeedMutation();
  const handleSeed = () => {
    seedMutation.mutate();
  };

  return (
    <>
      <h2>Admin</h2>
      <button onClick={handleSeed}>Seed</button>
    </>
  );
}
