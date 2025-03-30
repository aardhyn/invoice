import { useRef } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Flex, styled } from "panda/jsx";
import Frame from "react-frame-component";
import { useInvoiceGetQuery } from "api";
import { useFrameSize, useInvoiceTemplateState } from "utility";
import { H2, H3, InvoicePreview, DraftInvoiceMutationForm, Print, Text, Button, Section, Card, Code } from "component";

import invoiceTemplateStylesheet from "component/template/invoice/template.css?inline";

export const Route = createLazyFileRoute("/business/$businessKey/invoice/$invoiceKey")({
  component: Page,
});

function Page() {
  const { invoiceKey, businessKey } = Route.useParams();
  const invoiceId = parseInt(invoiceKey);
  const { data: invoice, error, isLoading } = useInvoiceGetQuery({ invoiceId });

  const [isTemplate, toggleTemplate] = useInvoiceTemplateState({ invoiceKey, businessKey });
  const toggleTemplateText = isTemplate ? "Remove from Templates" : "Save as Template";

  const ref = useRef<HTMLIFrameElement>(null);
  const { script, size } = useFrameSize(ref);

  if (isLoading) {
    return (
      <Section>
        <Card>
          <Text color="2">Loading...</Text>
        </Card>
      </Section>
    );
  }

  if (!invoice || error) {
    return (
      <Section>
        <Card>
          <Text color="2">Failed to load invoice</Text>
          <Code language="json">{error}</Code>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <Card>
        <Flex justify="space-between" gap="sm">
          <H2>{invoice.name}</H2>
          <Button onClick={toggleTemplate}>{toggleTemplateText}</Button>
        </Flex>
        <DraftInvoiceMutationForm initialInvoice={invoice} />
      </Card>
      <Card>
        <Flex justify="space-between" gap="sm">
          <H3>Preview</H3>
          <Print content={<InvoicePreview invoice={invoice} />} style={invoiceTemplateStylesheet}>
            <Button>Export</Button>
          </Print>
        </Flex>
        <PreviewFrame
          ref={ref}
          style={{
            height: size.height,
          }}
          initialContent={createInitialContent({ script, stylesheet: invoiceTemplateStylesheet })}
        >
          <InvoicePreview invoice={invoice} />
        </PreviewFrame>
      </Card>
    </Section>
  );
}

const PreviewFrame = styled(Frame, {
  base: {
    w: "100%",
  },
});

function createInitialContent({ script, stylesheet }: { script: string; stylesheet?: string }) {
  return `
    <html>
      <head>
        <script>
          ${script}
        </script>
        <style>
          ${stylesheet}
        </style>
      <head>
      <body>
        <div/>
      </body
    </html>
  `;
}
