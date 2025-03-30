import type { ComponentProps } from "react";
import { styled } from "panda/jsx";
import { Scroll } from "./Scroll";

const SectionRoot = styled("section", {
  base: {
    padding: "xl",
    w: "100%",
    h: "100%",
    overflowX: "hidden",
    overflowY: "auto",
  },
});

const SectionContent = styled("div", {
  base: {
    marginX: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "xl",
    w: "100%",
  },
  variants: {
    width: {
      sm: { maxW: "320px" },
      md: { maxW: "640px" },
      lg: { maxW: "960px" },
      xl: { maxW: "1280px" },
      max: { maxW: "100%" },
    },
  },
  defaultVariants: {
    width: "lg",
  },
});

type SectionProps = ComponentProps<typeof SectionRoot> & {
  width?: "sm" | "md" | "lg" | "xl" | "max";
};

export function Section({ width, ...props }: SectionProps) {
  return (
    <Scroll>
      <SectionRoot {...props}>
        <SectionContent width={width}>{props.children}</SectionContent>
      </SectionRoot>
    </Scroll>
  );
}
