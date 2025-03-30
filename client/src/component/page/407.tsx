import { useRouter } from "@tanstack/react-router";
import { styled } from "panda/jsx";
import { Section, H2, Text, Button } from "component";

export function Forbidden() {
  const router = useRouter();
  const handleBack = () => {
    router.history.back();
  };

  return (
    <Section>
      <Center>
        <H2>403</H2>
        <Text color="2">
          You do not have permission to view this page.{" "}
          <Button variant="ghost" onClick={handleBack}>
            Go back
          </Button>
          .
        </Text>
      </Center>
    </Section>
  );
}

const Center = styled("div", {
  base: {
    d: "flex",
    flexDirection: "column",
    gap: "md",
    alignItems: "flex-start",
    maxW: 256,
    w: "100%",
    justifyContent: "center",
    h: "100%",
  },
});
