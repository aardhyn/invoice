import { createLazyFileRoute } from "@tanstack/react-router";
import { Form } from "@radix-ui/react-form";
import { EyeOffIcon, KeyIcon, PackageIcon, SendIcon, Trash2Icon, UploadCloudIcon, UserIcon } from "lucide-react";
import { Flex, styled, VStack } from "panda/jsx";
import { config } from "constant";
import { capitalize } from "common";
import {
  Section,
  Card,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Button,
  TextField,
  Text,
  Checkbox,
  Textarea,
  Select,
  Code,
  Spacer,
} from "component";

export const Route = createLazyFileRoute("/admin/library")({
  component: Container,
});

function Container() {
  return (
    <Section>
      {Object.entries(COMPONENT_LIBRARY).map(([category, components]) => {
        return (
          <Card key={category}>
            <H3>{capitalize(category)}</H3>
            <div>{components}</div>
          </Card>
        );
      })}
      <Card>
        <H3>Colors</H3>
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
          {Object.entries(config.theme?.tokens?.colors || {}).map(([color, { value }]) => {
            return (
              <div key={color} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <ColorBox style={{ backgroundColor: value }} />
                <Text>{color}</Text>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <H3>Panda</H3>
        <Code r="xs">{config}</Code>
      </Card>
    </Section>
  );
}

const SpacerContainer = styled("div", {
  base: { d: "flex", g: "sm", "&>*": { b: "neutral", r: "sm" } },
});
const VerticalSpacerContainer = styled(SpacerContainer, {
  base: { fd: "column", alignItems: "flex-start" },
});
const HorizontalSpacerContainer = styled(SpacerContainer, {
  base: { h: 128 },
});

const ColorBox = styled("div", {
  base: { w: 32, r: "xs", ar: 1, ln: "neutral" },
});

const COMPONENT_LIBRARY = {
  typography: [
    <H1 key={1}>Heading 1</H1>,
    <H2 key={2}>Heading 2</H2>,
    <H3 key={3}>Heading 3</H3>,
    <H4 key={4}>Heading 4</H4>,
    <H5 key={5}>Heading 5</H5>,
    <H6 key={6}>Heading 6</H6>,
    <Text key={7} color="1">
      Text 1
    </Text>,
    <Text key={8} color="2">
      Text 2
    </Text>,
    <Text key={9} color="3">
      Text 3
    </Text>,
    <Text key={10} weight="2">
      Text weight 2
    </Text>,
    <Text key={11} weight="3">
      Text weight 3
    </Text>,
    <Text key={12} weight="4">
      Text weight 4
    </Text>,
    <Text key={13} weight="5">
      Text weight 5
    </Text>,
    <Text key={14} weight="6">
      Text weight 6
    </Text>,
  ],
  spacers: [
    <VerticalSpacerContainer key={1}>
      <Spacer size="sm" />
      <Spacer size="md" />
      <Spacer size="lg" />
      <Spacer size="xl" />
      <Spacer size="2xl" />
    </VerticalSpacerContainer>,
    <Spacer key={2} size="md" />,
    <HorizontalSpacerContainer key={3}>
      <Spacer size="sm" direction="horizontal" />
      <Spacer size="md" direction="horizontal" />
      <Spacer size="lg" direction="horizontal" />
      <Spacer size="xl" direction="horizontal" />
      <Spacer size="2xl" direction="horizontal" />
    </HorizontalSpacerContainer>,
  ],
  buttons: [
    <Flex key={1} gap="md" wrap="wrap">
      <Button color="primary" variant="solid">
        Create
      </Button>
      <Button color="primary" variant="outlined">
        Submit
      </Button>
      <Button color="primary" variant="ghost">
        Update
      </Button>
      <Button color="primary" variant="solid" disabled>
        Create
      </Button>
      <Button color="primary" variant="outlined" disabled>
        Submit
      </Button>
      <Button color="primary" variant="ghost" disabled>
        Update
      </Button>
    </Flex>,
    <Spacer key={2} size="md" />,
    <Flex key={3} gap="md" wrap="wrap">
      <Button color="tonal" variant="solid">
        Cancel
      </Button>
      <Button color="tonal" variant="outlined">
        Clear
      </Button>
      <Button color="tonal" variant="ghost">
        Reset
      </Button>
      <Button color="tonal" variant="solid" disabled>
        Cancel
      </Button>
      <Button color="tonal" variant="outlined" disabled>
        Clear
      </Button>
      <Button color="tonal" variant="ghost" disabled>
        Reset
      </Button>
    </Flex>,
    <Spacer key={4} size="md" />,
    <Flex key={5} gap="md" wrap="wrap">
      <Button color="primary" variant="solid" leadingIcon={<PackageIcon />}>
        Create
      </Button>
      <Button color="primary" variant="outlined" trailingIcon={<SendIcon />}>
        Submit
      </Button>
      <Button color="primary" variant="ghost" leadingIcon={<UploadCloudIcon />}>
        Update
      </Button>
      <Button color="primary" variant="solid" disabled leadingIcon={<PackageIcon />}>
        Create
      </Button>
      <Button color="primary" variant="outlined" disabled trailingIcon={<SendIcon />}>
        Submit
      </Button>
      <Button color="primary" variant="ghost" disabled leadingIcon={<UploadCloudIcon />}>
        Update
      </Button>
    </Flex>,
    <Spacer key={6} size="md" />,
    <Card key={7} maxWidth={400} r="xs">
      <Button color="primary" variant="solid" width="full">
        Submit
      </Button>
      <Button color="primary" variant="outlined" width="full" trailingIcon={<SendIcon />}>
        Send
      </Button>
      <Button color="tonal" variant="solid" width="full">
        Cancel
      </Button>
      <Button color="tonal" variant="outlined" width="full" leadingIcon={<Trash2Icon />}>
        Clear
      </Button>
    </Card>,
  ],
  forms: [
    <Form
      key={1}
      onSubmit={(e) => {
        alert("Form submitted");
        e.preventDefault();
      }}
    >
      <VStack gap="md" alignItems="flex-start">
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="csawyer@rct.uk"
          required
          leadingIcon={<UserIcon />}
          messages={[
            { match: "valueMissing", message: "Email is required" },
            { match: "typeMismatch", message: "Invalid email address" },
          ]}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          pattern=".{8,}"
          required
          leadingIcon={<KeyIcon />}
          trailingIcon={<EyeOffIcon />}
          messages={[
            { match: "valueMissing", message: "Password required" },
            {
              match: "patternMismatch",
              message: "Password must be at least 8 characters long",
            },
          ]}
        />
        <Checkbox label="Accept terms and conditions" name="accept-terms-and-conditions" required />
        <Textarea
          label="Message"
          name="message"
          required
          maxLength={256}
          width={256}
          placeholder="How did you hear about us?"
          messages={[
            { match: "valueMissing", message: "Message is required" },
            {
              match: "tooLong",
              message: "Message must be less than 256 characters",
            },
          ]}
        />
        <Select
          label="Country"
          name="country"
          placeholder="Select a country"
          required
          options={[
            { value: "new-zealand", label: "New Zealand" },
            { value: "australia", label: "Australia" },
            { value: "scotland", label: "Scotland" },
            { value: "england", label: "England", disabled: true },
            { value: "japan", label: "Japan" },
          ]}
        />
        <Button color="primary">Sign in</Button>
      </VStack>
    </Form>,
  ],
};
