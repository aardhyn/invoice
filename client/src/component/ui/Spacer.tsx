import { styled } from "panda/jsx";
import { cva } from "panda/css";

const styles = cva({
  variants: {
    size: {
      // xs: { "--size": "4px" },
      sm: { "--size": "8px" },
      md: { "--size": "16px" },
      lg: { "--size": "32px" },
      xl: { "--size": "64px" },
      "2xl": { "--size": "128px" },
      "3xl": { "--size": "256px" },
      max: { "--size": "100%" },
    },
    direction: {
      horizontal: { width: "var(--size)", h: "100%" },
      vertical: { height: "var(--size)", w: "100%" },
    },
    greedy: {
      true: { flex: 1 },
    },
  },
  defaultVariants: {
    direction: "vertical",
  },
});

export const Spacer = styled("div", styles);
