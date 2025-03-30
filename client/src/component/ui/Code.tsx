import type { ComponentProps } from "react";
import { Flex, styled } from "panda/jsx";
import { cva } from "panda/css";
import { CopyIcon } from "lucide-react";
import { type Override, addToClipboard, formatJson } from "common";
import { Button, Scroll, Json, Text } from "component";

const styles = cva({
  base: {
    bg: "base",
    b: "neutral",
  },
  variants: {
    inline: {
      true: {
        r: "xs",
        p: "xs",
        m: -4, // -xs
      },
      false: {
        r: "sm",
        p: "sm",
        g: "sm",
        fontSize: 14,
        maxH: 512,
        display: "grid",
        gridTemplateRows: "auto 1fr",
      },
    },
  },
  defaultVariants: {
    inline: false,
  },
});

const CodeRoot = styled("div", styles);

type CodeProps = Override<
  ComponentProps<typeof CodeRoot>,
  { children: string | object | number | null | undefined; language?: string }
>;

export function Code({ children, language = "plaintext", inline, ...props }: CodeProps) {
  const handleClick = () => {
    const text = formatJson(children);
    addToClipboard(text);
  };

  if (inline) {
    return (
      <CodeRoot inline={inline} {...props}>
        <Json>{children}</Json>
      </CodeRoot>
    );
  }

  return (
    <CodeRoot inline={inline} {...props}>
      <Flex justify="space-between" align="center" gap="sm">
        <Text scale="-1" case="upper" color="2" weight="3" inert>
          {language}
        </Text>
        <Button leadingIcon={<CopyIcon />} onClick={handleClick} variant="ghost" color="tonal" compact>
          Copy
        </Button>
      </Flex>
      <Scroll focusVisible>
        <Json>{children}</Json>
      </Scroll>
    </CodeRoot>
  );
}
